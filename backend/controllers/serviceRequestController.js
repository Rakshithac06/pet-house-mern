const ServiceRequest = require("../models/serviceRequestModel");

// Create a service request
const createServiceRequest = async (req, res) => {
    try {
        const {
            serviceId,
            date,
            time,
            address,
            phone,
            message
        } = req.body;

        if (
            !serviceId ||
            !date ||
            !time ||
            !address ||
            !phone
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields"
            });
        }

        const serviceRequest = await ServiceRequest.create({
            user: req.user.id,
            service: serviceId,
            date,
            time,
            address,
            phone,
            message
        });

        const populatedRequest =
            await ServiceRequest.findById(
                serviceRequest._id
            )
                .populate("service", "name price duration")
                .populate("user", "name email");

        res.status(201).json({
            success: true,
            message: "Service request submitted successfully",
            request: populatedRequest
        });

    } catch (error) {
        console.error(
            "Create service request error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to submit service request"
        });
    }
};


// Get logged-in user's service requests
const getMyServiceRequests = async (req, res) => {
    try {
        const requests =
            await ServiceRequest.find({
                user: req.user.id
            })
                .populate(
                    "service",
                    "name price duration"
                )
                .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error(
            "Get service requests error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to load service requests"
        });
    }
};


// Cancel user's service request
const cancelServiceRequest = async (req, res) => {
    try {
        const request =
            await ServiceRequest.findOne({
                _id: req.params.id,
                user: req.user.id
            });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Service request not found"
            });
        }

        if (
            request.status === "Completed" ||
            request.status === "Cancelled"
        ) {
            return res.status(400).json({
                success: false,
                message: "This request cannot be cancelled"
            });
        }

        request.status = "Cancelled";

        await request.save();

        res.status(200).json({
            success: true,
            message: "Service request cancelled successfully",
            request
        });

    } catch (error) {
        console.error(
            "Cancel service request error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to cancel service request"
        });
    }
};


module.exports = {
    createServiceRequest,
    getMyServiceRequests,
    cancelServiceRequest
};