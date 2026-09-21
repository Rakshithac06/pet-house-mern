const express = require("express");

const {
    createServiceRequest,
    getMyServiceRequests,
    cancelServiceRequest
} = require("../controllers/serviceRequestController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a service request
router.post(
    "/",
    authMiddleware,
    createServiceRequest
);

// Get logged-in user's service requests
router.get(
    "/my",
    authMiddleware,
    getMyServiceRequests
);

// Cancel a service request
router.put(
    "/:id/cancel",
    authMiddleware,
    cancelServiceRequest
);

module.exports = router;