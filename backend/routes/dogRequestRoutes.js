const express = require("express");

const {
    createDogRequest,
    getMyDogRequests
} = require("../controllers/dogRequestController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create purchase / adoption request
router.post("/", authMiddleware, createDogRequest);

// Get my requests
router.get("/", authMiddleware, getMyDogRequests);

module.exports = router;