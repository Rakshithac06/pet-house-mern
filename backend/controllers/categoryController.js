const Category = require("../models/categoryModel");

// Create category
const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({
            name: name.trim()
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name: name.trim(),
            description,
            image
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {
        console.error("Create category error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            categories
        });

    } catch (error) {
        console.error("Get categories error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Update category
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const {
            name,
            description,
            image
        } = req.body;

        if (name && name.trim() !== category.name) {
            const existingCategory = await Category.findOne({
                name: name.trim(),
                _id: { $ne: req.params.id }
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Category already exists"
                });
            }

            category.name = name.trim();
        }

        if (description !== undefined) {
            category.description = description;
        }

        if (image !== undefined) {
            category.image = image;
        }

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        console.error(
            "Update category error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Unable to update category"
        });
    }
};


// Delete category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        await Category.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete category error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Unable to delete category"
        });
    }
};


module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};