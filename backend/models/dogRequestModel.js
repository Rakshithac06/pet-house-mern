const mongoose = require("mongoose");

const dogRequestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        dog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dog",
            required: true
        },

        requestType: {
            type: String,
            enum: ["Purchase", "Adoption"],
            required: true
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected", "Completed"],
            default: "Pending"
        },

        message: {
            type: String,
            default: "",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("DogRequest", dogRequestSchema);