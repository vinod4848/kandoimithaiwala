const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

// Route to create a new address
router.post("/addresses", addressController.createAddress);

// Route to get all addresses
router.get("/addresses", addressController.getAllAddresses);

// Route to get addresses by userId
router.get("/addresses/user/:userId", addressController.getAddressesByUserId);

// Route to update an address by its ID
router.put("/addresses/:id", addressController.updateAddressById);

// Route to delete an address by its ID
router.delete("/addresses/:id", addressController.deleteAddressById);

// Route to get an address by its ID
router.get("/addresses/:id", addressController.getAddressById);

module.exports = router;

//90 40 60 20 90 30