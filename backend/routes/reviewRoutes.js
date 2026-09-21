const express = require("express");

const {
    createReview,
    getProductReviews,
    deleteReview
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Create a review
router.post(
    "/",
    authMiddleware,
    createReview
);


// Get reviews for a product
router.get(
    "/product/:productId",
    getProductReviews
);


// Delete own review
router.delete(
    "/:id",
    authMiddleware,
    deleteReview
);


module.exports = router;