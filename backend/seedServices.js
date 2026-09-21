require("dotenv").config();

const mongoose = require("mongoose");
const Service = require("./models/serviceModel");

const services = [
    {
        name: "Pet Grooming",
        description:
            "Professional grooming to keep your pet clean, healthy, and looking their best.",
        image: "pet-grooming.jpg",
        price: 499,
        duration: "1 Hour",
        available: true
    },
    {
        name: "Dog Walking",
        description:
            "Safe and enjoyable walks with experienced pet care professionals.",
        image: "dog-walking.jpg",
        price: 299,
        duration: "45 Minutes",
        available: true
    },
    {
        name: "Pet Sitting",
        description:
            "Reliable pet sitting service while you are away, with care and attention for your pet.",
        image: "pet-sitting.jpg",
        price: 599,
        duration: "Per Day",
        available: true
    },
    {
        name: "Pet Training",
        description:
            "Basic obedience and behavior training to help your pet learn and grow.",
        image: "pet-training.jpg",
        price: 799,
        duration: "1 Hour",
        available: true
    }
];

const seedServices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected.");

        await Service.deleteMany();

        await Service.insertMany(services);

        console.log("Services seeded successfully! 🐾");

        await mongoose.connection.close();

        console.log("MongoDB connection closed.");
    } catch (error) {
        console.error("Error seeding services:", error);
        process.exit(1);
    }
};

seedServices();