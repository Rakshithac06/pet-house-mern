const Wishlist = require("../models/wishlistModel");

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // JWT contains { id: user._id }
        const userId = req.user.id;

        let wishlist = await Wishlist.findOne({
            user: userId
        });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: userId,
                products: [productId]
            });
        } else {

            // Check if product already exists
            const alreadyExists = wishlist.products.some(
                id => id.toString() === productId
            );

            if (alreadyExists) {
                return res.status(400).json({
                    success: false,
                    message: "Product already in wishlist"
                });
            }

            wishlist.products.push(productId);
        }

        await wishlist.save();

        await wishlist.populate("products");

        res.status(201).json({
            success: true,
            message: "Product added to wishlist",
            wishlist
        });

    } catch (error) {
        console.error("Add to wishlist error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Get wishlist
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({
            user: userId
        }).populate("products");

        if (!wishlist) {
            return res.status(200).json({
                success: true,
                wishlist: {
                    products: []
                }
            });
        }

        res.status(200).json({
            success: true,
            wishlist
        });

    } catch (error) {
        console.error("Get wishlist error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({
            user: userId
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        wishlist.products = wishlist.products.filter(
            id => id.toString() !== productId
        );

        await wishlist.save();

        await wishlist.populate("products");

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            wishlist
        });

    } catch (error) {
        console.error("Remove from wishlist error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Clear wishlist
const clearWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({
            user: userId
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        wishlist.products = [];

        await wishlist.save();

        res.status(200).json({
            success: true,
            message: "Wishlist cleared successfully",
            wishlist
        });

    } catch (error) {
        console.error("Clear wishlist error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist
};