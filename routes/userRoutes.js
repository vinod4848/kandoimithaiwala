const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/verifyOtp", userController.verifyOtp);

router.post("/verifyOtpLogin", userController.verifyOtpLogin);

router.get("/users", userController.getAllUsers);

    router.put("/updateUser/:id",upload.single("image"), userController.updateUser);


router.get("/users/:id", userController.getUserById);

router.delete("/users/:id", userController.deleteUser);

module.exports = router;
