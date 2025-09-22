const express = require("express")
const { register, login, refreshToken, logout, testRegistration } = require("../controllers/authController")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refresh-token", refreshToken)
router.post("/logout", authenticateToken, logout)
router.post("/test", testRegistration) // Test endpoint for debugging

module.exports = router
