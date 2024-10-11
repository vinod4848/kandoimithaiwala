const bcrypt = require('bcryptjs');
const User = require("../models/User");
const mongoose = require("mongoose");

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const otps = {}; 

const sendOtp = async (phoneNumber, otp) => {
  console.log(`Sending OTP ${otp} to ${phoneNumber}`);

};

const registerUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      return res.status(400).json({ message: "User with this phone number already exists", existingUser });
    }

    const otp = generateOtp();
    await sendOtp(phoneNumber, otp);
    otps[phoneNumber] = otp; 

    res.status(200).json({ message: "OTP sent successfully. Please verify.", otp});
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ message: "Failed to register user" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (otps[phoneNumber] && otps[phoneNumber] === otp) {
      const newUser = new User({ phoneNumber });
      await newUser.save();
      delete otps[phoneNumber]; 

      return res.status(201).json({ message: "Verify Otp successfully",newUser });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Error during OTP verification:", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Check if the user exists in the database
    const existingUser = await User.findOne({ phoneNumber });
    
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new OTP
    const otp = generateOtp(); 
    await sendOtp(phoneNumber, otp);
    otps[phoneNumber] = otp; // Store the new OTP

    res.status(200).json({ message: "OTP sent successfully. Please verify." ,otp});
  } catch (err) {
    console.error("Error during OTP login:", err);
    res.status(500).json({ message: "Failed to initiate OTP login" });
  }
};


const verifyOtpLogin = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (otps[phoneNumber] && otps[phoneNumber] === otp) {
      delete otps[phoneNumber];

      res.status(200).json({ message: "Login successful", userId: phoneNumber });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Error during OTP verification:", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error.message, error.stack);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  verifyOtpLogin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
