const express = require("express");

const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addToCart);

router.get("/", authMiddleware, getCart);

router.put("/:productId", authMiddleware, updateCartItem);

router.delete("/:productId", authMiddleware, removeFromCart);

router.delete("/", authMiddleware, clearCart);

module.exports = router;