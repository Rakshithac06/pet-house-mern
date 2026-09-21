const User = require("../models/userModel");

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }

        next();

    } catch (error) {
        console.error("Admin middleware error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = adminMiddleware;