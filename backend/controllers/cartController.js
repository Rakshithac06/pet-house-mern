const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Add product to cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [
                    {
                        product: productId,
                        quantity
                    }
                ]
            });
        } else {
            const existingItem = cart.items.find(
                item => item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({
                    product: productId,
                    quantity
                });
            }

            await cart.save();
        }

        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart
        });

    } catch (error) {
        console.error("Add to cart error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Get cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product");

        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: {
                    items: []
                }
            });
        }

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        console.error("Get cart error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Update cart item
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        item.quantity = quantity;

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart
        });

    } catch (error) {
        console.error("Update cart error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Remove product from cart
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart
        });

    } catch (error) {
        console.error("Remove cart item error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Clear cart
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Cart already empty"
            });
        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });

    } catch (error) {
        console.error("Clear cart error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart
};