const express = require("express");

const {
    getServices,
    getServiceById
} = require("../controllers/serviceController");

const router = express.Router();

// Get all available services
router.get("/", getServices);

// Get single service
router.get("/:id", getServiceById);

module.exports = router;