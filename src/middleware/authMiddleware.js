const User = require("../models/userModel")
const AppError = require("../utils/AppError")
const asyncHandler = require("../utils/asyncHandler")
const { verifyToken } = require("../utils/jwtHelper") 

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return next(new AppError("You are not logged in. Please login to continue.", 401))
  }

  let decoded
  try {
    decoded = verifyToken(token) 
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Your session has expired. Please login again.", 401))
    }
    return next(new AppError("Invalid token. Please login again.", 401))
  }

  const user = await User.findById(decoded.id)
  if (!user || !user.isActive) {
    return next(new AppError("User no longer exists.", 401))
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("Password recently changed. Please login again.", 401))
  }

  req.user = user
  next()
})

module.exports = { protect }