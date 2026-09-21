const ServiceRequest = require("../models/serviceRequestModel");

// Admin: Get all service requests
const getAllServiceRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find()
            .populate("user", "name email")
            .populate("service", "name price duration")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error(
            "Get all service requests error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to load service requests"
        });
    }
};


// Admin: Update service request status
const updateServiceRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Completed",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service request status"
            });
        }

        const request =
            await ServiceRequest.findById(
                req.params.id
            );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Service request not found"
            });
        }

        request.status = status;

        await request.save();

        const updatedRequest =
            await ServiceRequest.findById(
                request._id
            )
                .populate("user", "name email")
                .populate(
                    "service",
                    "name price duration"
                );

        res.status(200).json({
            success: true,
            message:
                "Service request updated successfully",
            request: updatedRequest
        });

    } catch (error) {
        console.error(
            "Update service request error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to update service request"
        });
    }
};


module.exports = {
    getAllServiceRequests,
    updateServiceRequestStatus
};