const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

// Create a review
const createReview = async (req, res) => {
    try {
        const {
            productId,
            rating,
            comment
        } = req.body;

        if (!productId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Product, rating and comment are required"
            });
        }

        if (Number(rating) < 1 || Number(rating) > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            user: req.user.id,
            product: productId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        const review = await Review.create({
            user: req.user.id,
            product: productId,
            rating: Number(rating),
            comment
        });

        const populatedReview = await Review.findById(review._id)
            .populate("user", "name");

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: populatedReview
        });

    } catch (error) {
        console.error("Create review error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to add review"
        });
    }
};


// Get reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            product: req.params.productId
        })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });

    } catch (error) {
        console.error("Get product reviews error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load reviews"
        });
    }
};


// Delete own review
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        await Review.findByIdAndDelete(review._id);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.error("Delete review error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete review"
        });
    }
};


module.exports = {
    createReview,
    getProductReviews,
    deleteReview
};