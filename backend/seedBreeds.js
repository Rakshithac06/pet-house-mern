const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const Breed = require("./models/breedModel");

dotenv.config();

const seedBreeds = async () => {
    try {
        await connectDB();

        await Breed.deleteMany({});

        await Breed.insertMany([
            {
                name: "Golden Retriever",
                emoji: "🐕",
                description:
                    "Friendly, intelligent and devoted dogs known for their gentle temperament."
            },
            {
                name: "Labrador Retriever",
                emoji: "🐶",
                description:
                    "Friendly and outgoing dogs that are excellent companions and family pets."
            },
            {
                name: "German Shepherd",
                emoji: "🐕‍🦺",
                description:
                    "Intelligent, courageous and versatile dogs often known for their loyalty."
            },
            {
                name: "Beagle",
                emoji: "🐶",
                description:
                    "Curious, energetic and friendly dogs with a strong sense of smell."
            }
        ]);

        console.log("✅ Breeds added successfully!");

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("❌ Error seeding breeds:", error);
        process.exit(1);
    }
};

seedBreeds();