const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/verifyOtp", userController.verifyOtp);

router.post("/verifyOtpLogin", userController.verifyOtpLogin);

router.get("/users", userController.getAllUsers);

router.put("/users/:id", userController.updateUser);

router.get("/users/:id", userController.getUserById);

router.delete("/users/:id", userController.deleteUser);

module.exports = router;
