const Dog = require("../models/dogModel");

// Get all dogs for Admin
const getAllDogs = async (req, res) => {
    try {
        const dogs = await Dog.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: dogs.length,
            dogs
        });

    } catch (error) {
        console.error("Get all dogs error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load dogs"
        });
    }
};

// Add a new dog
const createDog = async (req, res) => {
    try {
        const {
            name,
            breed,
            age,
            gender,
            description,
            image,
            type,
            price,
            location
        } = req.body;

        if (
            !name ||
            !breed ||
            age === undefined ||
            !gender ||
            !description ||
            !image ||
            !type ||
            !location
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const dog = await Dog.create({
            name,
            breed,
            age,
            gender,
            description,
            image,
            type,
            price: type === "Adoption" ? 0 : price || 0,
            location,
            available: true
        });

        res.status(201).json({
            success: true,
            message: "Dog added successfully",
            dog
        });

    } catch (error) {
        console.error("Create dog error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to add dog"
        });
    }
};

// Update a dog
const updateDog = async (req, res) => {
    try {
        const dog = await Dog.findById(req.params.id);

        if (!dog) {
            return res.status(404).json({
                success: false,
                message: "Dog not found"
            });
        }

        const {
            name,
            breed,
            age,
            gender,
            description,
            image,
            type,
            price,
            location,
            available
        } = req.body;

        dog.name = name ?? dog.name;
        dog.breed = breed ?? dog.breed;
        dog.age = age ?? dog.age;
        dog.gender = gender ?? dog.gender;
        dog.description = description ?? dog.description;
        dog.image = image ?? dog.image;
        dog.type = type ?? dog.type;
        dog.location = location ?? dog.location;
        dog.available = available ?? dog.available;

        if (dog.type === "Adoption") {
            dog.price = 0;
        } else {
            dog.price = price ?? dog.price;
        }

        await dog.save();

        res.status(200).json({
            success: true,
            message: "Dog updated successfully",
            dog
        });

    } catch (error) {
        console.error("Update dog error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update dog"
        });
    }
};

// Delete a dog
const deleteDog = async (req, res) => {
    try {
        const dog = await Dog.findById(req.params.id);

        if (!dog) {
            return res.status(404).json({
                success: false,
                message: "Dog not found"
            });
        }

        await Dog.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Dog deleted successfully"
        });

    } catch (error) {
        console.error("Delete dog error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete dog"
        });
    }
};

module.exports = {
    getAllDogs,
    createDog,
    updateDog,
    deleteDog
};