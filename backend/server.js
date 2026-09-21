const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const dogRoutes = require("./routes/dogRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const donationRoutes = require("./routes/donationRoutes");
const dogRequestRoutes = require("./routes/dogRequestRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const breedRoutes = require("./routes/breedRoutes");
const adminDogRequestRoutes = require("./routes/adminDogRequestRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminDogRoutes = require("./routes/adminDogRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminServiceRequestRoutes = require("./routes/adminServiceRequestRoutes");


dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/dogs", dogRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/dog-requests", dogRequestRoutes);
app.use("/api/service-requests",serviceRequestRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/breeds", breedRoutes);
app.use("/api/admin/dog-requests", adminDogRequestRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/dogs", adminDogRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/service-requests", adminServiceRequestRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Pet House Backend is running!");
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});