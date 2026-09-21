const express = require("express");

const {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist
} = require("../controllers/wishlistController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add product to wishlist
router.post("/", authMiddleware, addToWishlist);

// Get wishlist
router.get("/", authMiddleware, getWishlist);

// Remove product from wishlist
router.delete("/:productId", authMiddleware, removeFromWishlist);

// Clear wishlist
router.delete("/", authMiddleware, clearWishlist);

module.exports = router;