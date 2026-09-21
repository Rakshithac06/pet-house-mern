const express = require("express");

const {
    getAllBreeds,
    getBreedById,
    createBreed,
    updateBreed,
    deleteBreed
} = require("../controllers/breedController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllBreeds);
router.get("/:id", getBreedById);

// Admin routes
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createBreed
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateBreed
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteBreed
);

module.exports = router;