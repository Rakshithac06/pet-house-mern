const Service = require("../models/serviceModel");

// Get all available services
const getServices = async (req, res) => {
    try {
        const services = await Service.find({
            available: true
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: services.length,
            services
        });
    } catch (error) {
        console.error("Get services error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load services"
        });
    }
};

// Get service by ID
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            service
        });
    } catch (error) {
        console.error("Get service error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load service"
        });
    }
};

module.exports = {
    getServices,
    getServiceById
};