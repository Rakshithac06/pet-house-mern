const express = require("express");

const {
    createDonation,
    getMyDonations,
    getDonationById
} = require("../controllers/donationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a donation
router.post(
    "/",
    authMiddleware,
    createDonation
);

// Get logged-in user's donations
router.get(
    "/my",
    authMiddleware,
    getMyDonations
);

// Get single donation
router.get(
    "/:id",
    authMiddleware,
    getDonationById
);

module.exports = router;