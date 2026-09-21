const DogRequest = require("../models/dogRequestModel");
const Dog = require("../models/dogModel");

// Create Buy / Adoption Request
const createDogRequest = async (req, res) => {
    try {
        const { dogId, requestType, message } = req.body;

        if (!dogId || !requestType) {
            return res.status(400).json({
                success: false,
                message: "Dog and request type are required"
            });
        }

        const dog = await Dog.findById(dogId);

        if (!dog) {
            return res.status(404).json({
                success: false,
                message: "Dog not found"
            });
        }

        if (!dog.available) {
            return res.status(400).json({
                success: false,
                message: "This dog is no longer available"
            });
        }

        if (dog.type === "Sale" && requestType !== "Purchase") {
            return res.status(400).json({
                success: false,
                message: "This dog is available for purchase"
            });
        }

        if (dog.type === "Adoption" && requestType !== "Adoption") {
            return res.status(400).json({
                success: false,
                message: "This dog is available for adoption"
            });
        }

        const existingRequest = await DogRequest.findOne({
            user: req.user.id,
            dog: dogId,
            status: "Pending"
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending request for this dog"
            });
        }

        const request = await DogRequest.create({
            user: req.user.id,
            dog: dogId,
            requestType,
            message: message || ""
        });

        const populatedRequest = await DogRequest.findById(request._id)
            .populate("dog")
            .populate("user", "name email");

        res.status(201).json({
            success: true,
            message: "Request submitted successfully",
            request: populatedRequest
        });

    } catch (error) {
        console.error("Create dog request error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Get My Dog Requests
const getMyDogRequests = async (req, res) => {
    try {
        const requests = await DogRequest.find({
            user: req.user.id
        })
            .populate("dog")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error("Get dog requests error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    createDogRequest,
    getMyDogRequests
};