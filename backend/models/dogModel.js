const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        breed: {
            type: String,
            required: true,
            trim: true
        },

        age: {
            type: Number,
            required: true,
            min: 0
        },

        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: true
        },

        description: {
            type: String,
            required: true
        },

        image: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: ["Sale", "Adoption"],
            required: true
        },

        price: {
            type: Number,
            default: 0,
            min: 0
        },

        location: {
            type: String,
            required: true
        },

        available: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Dog", dogSchema);