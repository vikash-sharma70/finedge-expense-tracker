const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Transaction Type is required"],
      enum: ["income", "expense"],
    },

    category: {
      type: String,
      required: [true, "Transaction category is required"],
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Number is required"],
      min: [0, "Amount cannot be negative"],
    },
    date: {
      type: Date,
      default: Date.now, // Requirement from the brief[cite: 1]
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links the transaction to a specific user[cite: 1]
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
