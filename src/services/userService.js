// src/services/userService.js
const User = require("../models/userModel")
const AppError = require("../utils/AppError")
const { generateToken } = require("../utils/jwtHelper")  // ← Yahan se import

// ─── USER REGISTER ─────────────────────────────────────
const registerUser = async (userData) => {
  const { name, email, password, currency, monthlyBudget } = userData

  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    throw new AppError("Email already registered. Please login.", 409)
  }

  const user = await User.create({
    name,
    email,
    password,
    currency,
    monthlyBudget,
  })

  const token = generateToken(user._id)  // ← jwtHelper se aa raha hai

  return { user, token }
}

// ─── USER LOGIN ────────────────────────────────────────
const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400)
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password")

  if (!user) {
    throw new AppError("Invalid email or password", 401)
  }

  if (!user.isActive) {
    throw new AppError("Your account has been deactivated. Contact support.", 403)
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401)
  }

  user.lastLogin = new Date()
  await user.save({ validateBeforeSave: false })

  const token = generateToken(user._id)  // ← jwtHelper se aa raha hai

  return { user, token }
}

// ─── GET USER PROFILE ──────────────────────────────────
const getUserProfile = async (userId) => {
  const user = await User.findById(userId)

  if (!user || !user.isActive) {
    throw new AppError("User not found", 404)
  }

  return user
}

// ─── UPDATE USER PROFILE ───────────────────────────────
const updateUserProfile = async (userId, updateData) => {
  const notAllowed = ["password", "email", "isActive"]
  notAllowed.forEach((field) => delete updateData[field])

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  )

  if (!user) {
    throw new AppError("User not found", 404)
  }

  return user
}

// ─── CHANGE PASSWORD ───────────────────────────────────
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password")

  if (!user) {
    throw new AppError("User not found", 404)
  }

  const isCorrect = await user.comparePassword(currentPassword)
  if (!isCorrect) {
    throw new AppError("Current password is incorrect", 400)
  }

  if (currentPassword === newPassword) {
    throw new AppError("New password must be different from current password", 400)
  }

  user.password = newPassword
  await user.save()

  const token = generateToken(user._id)  // ← jwtHelper se aa raha hai
  return { token }
}

// ─── DEACTIVATE ACCOUNT ────────────────────────────────
const deactivateAccount = async (userId, password) => {
  const user = await User.findById(userId).select("+password")

  if (!user) {
    throw new AppError("User not found", 404)
  }

  const isCorrect = await user.comparePassword(password)
  if (!isCorrect) {
    throw new AppError("Incorrect password", 400)
  }

  user.isActive = false
  await user.save({ validateBeforeSave: false })
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deactivateAccount,
}