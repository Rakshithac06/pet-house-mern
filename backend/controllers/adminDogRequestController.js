const DogRequest = require("../models/dogRequestModel");
const Dog = require("../models/dogModel");

// Get all dog requests
const getAllDogRequests = async (req, res) => {
    try {
        const requests = await DogRequest.find()
            .populate("user", "name email")
            .populate("dog")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error("Get all dog requests error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Update dog request status
const updateDogRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Approved",
            "Rejected",
            "Completed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request status"
            });
        }

        const request = await DogRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Dog request not found"
            });
        }

        request.status = status;

        await request.save();

        // If request is approved, make the dog unavailable
        if (status === "Approved") {
            await Dog.findByIdAndUpdate(request.dog, {
                available: false
            });
        }

        const populatedRequest = await DogRequest.findById(request._id)
            .populate("user", "name email")
            .populate("dog");

        res.status(200).json({
            success: true,
            message: `Request ${status.toLowerCase()} successfully`,
            request: populatedRequest
        });

    } catch (error) {
        console.error("Update dog request error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getAllDogRequests,
    updateDogRequestStatus
};