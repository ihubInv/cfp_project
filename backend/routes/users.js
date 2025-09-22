const express = require("express")
const { getAllUsers, createUser, updateUser, deleteUser, getUserStats } = require("../controllers/userController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// All routes require admin access
router.use(authenticateToken, authorizeRoles("Admin"))

router.get("/", getAllUsers)
router.post("/", createUser)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)
router.get("/stats", getUserStats)

module.exports = router
