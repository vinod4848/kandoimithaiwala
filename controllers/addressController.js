const Address = require("../models/Address");

// Controller to create a new address
const createAddress = async (req, res) => {
  try {
    const { userId, flat, area, city, state, pincode } = req.body;

    // Create new address instance
    const newAddress = new Address({
      userId,
      flat,
      area,
      city,
      state,
      pincode,
    });

    // Save the address to the database
    const savedAddress = await newAddress.save();

    res.status(201).json(savedAddress);
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ message: "Failed to create address" });
  }
};

// Controller to get all addresses
const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find().populate('userId');
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

// Controller to get addresses by userId
const getAddressesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const addresses = await Address.find({ userId: userId }).populate('userId');

    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

// Controller to update an address by its ID
const updateAddressById = async (req, res) => {
  try {
    const addressId = req.params.id;
    const updates = req.body;

    // Update the address
    const updatedAddress = await Address.findByIdAndUpdate(addressId, updates, {
      new: true,
    });

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
};

// Controller to delete an address by its ID
const deleteAddressById = async (req, res) => {
  try {
    const addressId = req.params.id;

    // Delete the address
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully", address: deletedAddress });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
};

// Controller to get an address by its ID
const getAddressById = async (req, res) => {
  try {
    const addressId = req.params.id;

    // Find address by its ID
    const address = await Address.findById(addressId).populate('userId');

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Failed to fetch address" });
  }
};

module.exports = {
  createAddress,
  getAllAddresses,
  getAddressesByUserId,
  getAddressById,
  updateAddressById,
  deleteAddressById,
};
