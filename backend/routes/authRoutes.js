const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

// Protected route
router.get("/profile", authMiddleware, async (req, res) => {
    res.status(200).json({
        success: true,
        message: "You can access this protected route",
        userId: req.user.id
    });
});

module.exports = router;