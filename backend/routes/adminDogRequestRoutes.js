const express = require("express");

const {
    getAllDogRequests,
    updateDogRequestStatus
} = require("../controllers/adminDogRequestController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllDogRequests
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateDogRequestStatus
);

module.exports = router;