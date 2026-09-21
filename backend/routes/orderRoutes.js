const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Create Order
router.post("/", authMiddleware, createOrder);


// Get My Orders
router.get("/", authMiddleware, getMyOrders);


// Get Single Order
router.get("/:id", authMiddleware, getOrderById);


// Cancel Order
router.put("/:id/cancel", authMiddleware, cancelOrder);


module.exports = router;