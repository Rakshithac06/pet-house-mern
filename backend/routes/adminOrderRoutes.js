const express = require("express");

const {
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Admin: Get all orders
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);

// Admin: Update order/payment status
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);

module.exports = router;