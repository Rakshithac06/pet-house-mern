const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

// Create Order
const createOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user.id })
            .populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Calculate product subtotal
        let subtotal = 0;

        const orderItems = cart.items.map((item) => {
            const price = item.product.price;

            subtotal += price * item.quantity;

            return {
                product: item.product._id,
                quantity: item.quantity,
                price: price
            };
        });

        // Shipping charge
        const shipping = 50;

        // Final order total
        const totalAmount = subtotal + shipping;

        console.log("SUBTOTAL:", subtotal);
        console.log("SHIPPING:", shipping);
        console.log("FINAL TOTAL:", totalAmount);

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod: "COD"
        });

        // Clear cart after order creation
        cart.items = [];
        await cart.save();

        // Return order
        const populatedOrder = await Order.findById(order._id)
            .populate("items.product", "name price image");

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: populatedOrder
        });

    } catch (error) {
        console.error("Create order error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Get My Orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate("items.product", "name price image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Get orders error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Get Single Order
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate("items.product", "name price image");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error("Get order error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Cancel Order
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.orderStatus === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "Delivered order cannot be cancelled"
            });
        }

        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Order is already cancelled"
            });
        }

        order.orderStatus = "Cancelled";

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        console.error("Cancel order error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Admin: Get All Orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product", "name price image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Get all orders error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load orders"
        });
    }
};


// Admin: Update Order Status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (orderStatus !== undefined) {
            const allowedOrderStatuses = [
                "Pending",
                "Confirmed",
                "Shipped",
                "Delivered",
                "Cancelled"
            ];

            if (!allowedOrderStatuses.includes(orderStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid order status"
                });
            }

            order.orderStatus = orderStatus;
        }

        if (paymentStatus !== undefined) {
            const allowedPaymentStatuses = [
                "Pending",
                "Paid",
                "Failed"
            ];

            if (!allowedPaymentStatuses.includes(paymentStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid payment status"
                });
            }

            order.paymentStatus = paymentStatus;
        }

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate("user", "name email")
            .populate("items.product", "name price image");

        res.status(200).json({
            success: true,
            message: "Order updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error("Update order status error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update order"
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
};