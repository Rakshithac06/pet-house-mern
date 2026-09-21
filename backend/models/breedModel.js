const mongoose = require("mongoose");

const breedSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    emoji: {
      type: String,
      default: "🐶"
    },

    description: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Breed", breedSchema);