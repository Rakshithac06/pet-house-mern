const express = require("express");

const {
    getAllServiceRequests,
    updateServiceRequestStatus
} = require("../controllers/adminServiceRequestController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Admin: Get all service requests
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllServiceRequests
);

// Admin: Update service request status
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateServiceRequestStatus
);

module.exports = router;