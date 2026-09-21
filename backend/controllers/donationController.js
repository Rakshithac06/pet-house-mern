const Donation = require("../models/donationModel");

// Create a donation
const createDonation = async (req, res) => {
    try {
        const {
            amount,
            donorName,
            phone,
            message
        } = req.body;

        if (!amount || !donorName || !phone) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields"
            });
        }

        if (Number(amount) < 1) {
            return res.status(400).json({
                success: false,
                message: "Donation amount must be at least ₹1"
            });
        }

        const donation = await Donation.create({
            user: req.user.id,
            amount: Number(amount),
            donorName,
            phone,
            message,
            paymentMethod: "COD"
        });

        const populatedDonation =
            await Donation.findById(donation._id)
                .populate("user", "name email");

        res.status(201).json({
            success: true,
            message: "Donation submitted successfully",
            donation: populatedDonation
        });

    } catch (error) {
        console.error("Create donation error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to submit donation"
        });
    }
};


// Get logged-in user's donations
const getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: donations.length,
            donations
        });

    } catch (error) {
        console.error("Get my donations error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load donations"
        });
    }
};


// Get a single donation
const getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found"
            });
        }

        res.status(200).json({
            success: true,
            donation
        });

    } catch (error) {
        console.error("Get donation error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load donation"
        });
    }
};


module.exports = {
    createDonation,
    getMyDonations,
    getDonationById
};