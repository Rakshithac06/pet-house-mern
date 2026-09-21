const Dog = require("../models/dogModel");

// Get all available dogs
const getDogs = async (req, res) => {
    try {
        const dogs = await Dog.find({ available: true })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: dogs.length,
            dogs
        });

    } catch (error) {
        console.error("Get dogs error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Get single dog
const getDogById = async (req, res) => {
    try {
        const dog = await Dog.findById(req.params.id);

        if (!dog) {
            return res.status(404).json({
                success: false,
                message: "Dog not found"
            });
        }

        res.status(200).json({
            success: true,
            dog
        });

    } catch (error) {
        console.error("Get dog error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getDogs,
    getDogById
};