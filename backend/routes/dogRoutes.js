const express = require("express");

const {
    getDogs,
    getDogById
} = require("../controllers/dogController");

const router = express.Router();

// Get all available dogs
router.get("/", getDogs);

// Get single dog
router.get("/:id", getDogById);

module.exports = router;