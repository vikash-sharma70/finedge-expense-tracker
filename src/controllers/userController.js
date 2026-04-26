const userService = require("../services/userService")
const asyncHandler = require("../utils/asyncHandler")
const { sendSuccess } = require("../utils/responseHandler")

exports.register = asyncHandler(async (req, res) => {
  const { user, token } = await userService.registerUser(req.body)

  sendSuccess(res, 201, "Account created successfully", { user, token })
})

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const { user, token } = await userService.loginUser(email, password)

  sendSuccess(res, 200, "Login successful", { user, token })
})

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user._id)

  sendSuccess(res, 200, "Profile fetched successfully", { user })
})

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUserProfile(req.user._id, req.body)

  sendSuccess(res, 200, "Profile updated successfully", { user })
})

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const { token } = await userService.changePassword(
    req.user._id,
    currentPassword,
    newPassword
  )

  sendSuccess(res, 200, "Password changed successfully", { token })
})

exports.deactivateAccount = asyncHandler(async (req, res) => {
  const { password } = req.body
  await userService.deactivateAccount(req.user._id, password)

  sendSuccess(res, 200, "Account deactivated successfully")
})