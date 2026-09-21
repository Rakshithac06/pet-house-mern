const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Dog = require("./models/dogModel");

dotenv.config();

const dogs = [
    {
        name: "Bruno",
        breed: "Golden Retriever",
        age: 2,
        gender: "Male",
        description: "Friendly, playful and well-trained Golden Retriever looking for a loving family.",
        image: "golden-retriever.jpg",
        type: "Sale",
        price: 35000,
        location: "Bangalore",
        available: true
    },
    {
        name: "Bella",
        breed: "Labrador Retriever",
        age: 1,
        gender: "Female",
        description: "Active and affectionate Labrador who loves playing and spending time with people.",
        image: "labrador.jpg",
        type: "Sale",
        price: 28000,
        location: "Bangalore",
        available: true
    },
    {
        name: "Rocky",
        breed: "German Shepherd",
        age: 3,
        gender: "Male",
        description: "Loyal and intelligent German Shepherd with a calm and protective nature.",
        image: "german-shepherd.jpg",
        type: "Sale",
        price: 40000,
        location: "Bangalore",
        available: true
    },
    {
        name: "Daisy",
        breed: "Indie",
        age: 2,
        gender: "Female",
        description: "Sweet and loving Indie dog rescued from the streets and ready for a forever home.",
        image: "indie-dog.jpg",
        type: "Adoption",
        price: 0,
        location: "Bangalore",
        available: true
    },
    {
        name: "Max",
        breed: "Beagle",
        age: 1,
        gender: "Male",
        description: "Energetic and cheerful Beagle who enjoys walks, games and lots of attention.",
        image: "beagle.jpg",
        type: "Adoption",
        price: 0,
        location: "Mysore",
        available: true
    },
    {
        name: "Luna",
        breed: "Shih Tzu",
        age: 2,
        gender: "Female",
        description: "Gentle and affectionate companion dog who loves being around people.",
        image: "shih-tzu.jpg",
        type: "Sale",
        price: 30000,
        location: "Bangalore",
        available: true
    }
];

const seedDogs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Dog.deleteMany();

        await Dog.insertMany(dogs);

        console.log("Dogs added successfully! 🐶");

        process.exit();
    } catch (error) {
        console.error("Error seeding dogs:", error);
        process.exit(1);
    }
};

seedDogs();