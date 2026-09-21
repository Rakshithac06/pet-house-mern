const express = require("express");

const {
    getAllDogs,
    createDog,
    updateDog,
    deleteDog
} = require("../controllers/adminDogController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllDogs
);

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createDog
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateDog
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteDog
);

module.exports = router;