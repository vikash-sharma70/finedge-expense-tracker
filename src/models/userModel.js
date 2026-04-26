const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [20, "Name cannot exceed 20 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, 
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    passwordChangedAt: Date,
  },
  {
    timestamps: true, 
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password       
        delete ret.__v
        return ret
      },
    },
  }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12
  this.password = await bcrypt.hash(this.password, saltRounds)

  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000
  }

  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return jwtTimestamp < changedTimestamp
  }
  return false
}

const User = mongoose.model("User", userSchema)

module.exports = User