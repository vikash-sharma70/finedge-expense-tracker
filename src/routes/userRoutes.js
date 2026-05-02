const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { protect } = require("../middleware/authMiddleware")

router.post("/register", userController.register)
router.post("/login", userController.login)

router.get("/profile", protect, userController.getProfile)
router.patch("/profile", protect, userController.updateProfile)
router.patch("/change-password", protect, userController.changePassword)
router.delete("/account", protect, userController.deactivateAccount)

module.exports = router