const Dog = require("../models/dogModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const DogRequest = require("../models/dogRequestModel");

const getDashboardStats = async (req, res) => {
    try {
        const totalDogs = await Dog.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Don't count Admin accounts as customers
        const totalCustomers = await User.countDocuments({
            role: "User"
        });

        const totalDogRequests = await DogRequest.countDocuments();

        res.status(200).json({
            success: true,
            stats: {
                totalDogs,
                totalOrders,
                totalCustomers,
                totalDogRequests
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load dashboard statistics"
        });
    }
};

module.exports = {
    getDashboardStats
};