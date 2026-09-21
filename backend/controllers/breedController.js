const Breed = require("../models/breedModel");

// Get all breeds
const getAllBreeds = async (req, res) => {
    try {
        const breeds = await Breed.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: breeds.length,
            breeds
        });
    } catch (error) {
        console.error("Get breeds error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load breeds"
        });
    }
};

// Get single breed
const getBreedById = async (req, res) => {
    try {
        const breed = await Breed.findById(req.params.id);

        if (!breed) {
            return res.status(404).json({
                success: false,
                message: "Breed not found"
            });
        }

        res.status(200).json({
            success: true,
            breed
        });
    } catch (error) {
        console.error("Get breed error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load breed"
        });
    }
};

// Create breed
const createBreed = async (req, res) => {
    try {
        const { name, emoji, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Breed name and description are required"
            });
        }

        const existingBreed = await Breed.findOne({ name });

        if (existingBreed) {
            return res.status(400).json({
                success: false,
                message: "Breed already exists"
            });
        }

        const breed = await Breed.create({
            name,
            emoji: emoji || "🐶",
            description
        });

        res.status(201).json({
            success: true,
            message: "Breed created successfully",
            breed
        });
    } catch (error) {
        console.error("Create breed error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to create breed"
        });
    }
};

// Update breed
const updateBreed = async (req, res) => {
    try {
        const { name, emoji, description } = req.body;

        const breed = await Breed.findById(req.params.id);

        if (!breed) {
            return res.status(404).json({
                success: false,
                message: "Breed not found"
            });
        }

        breed.name = name || breed.name;
        breed.emoji = emoji || breed.emoji;
        breed.description = description || breed.description;

        await breed.save();

        res.status(200).json({
            success: true,
            message: "Breed updated successfully",
            breed
        });
    } catch (error) {
        console.error("Update breed error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update breed"
        });
    }
};

// Delete breed
const deleteBreed = async (req, res) => {
    try {
        const breed = await Breed.findById(req.params.id);

        if (!breed) {
            return res.status(404).json({
                success: false,
                message: "Breed not found"
            });
        }

        await Breed.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Breed deleted successfully"
        });
    } catch (error) {
        console.error("Delete breed error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete breed"
        });
    }
};

module.exports = {
    getAllBreeds,
    getBreedById,
    createBreed,
    updateBreed,
    deleteBreed
};