const PinCode = require("../models/PinCode");

exports.checkDelivery = async (req, res) => {
  const { pinCode } = req.body;
  if (!pinCode) {
    return res.status(400).json({
      message: "Pin code is required",
    });
  }
  try {
    const pinCodeData = await PinCode.findOne({
      pinCode,
    });
    if (pinCodeData) {
      if (pinCodeData.deliveryAvailable) {
        return res.status(200).json({
          message: "Delivery service is available",
        });
      } else {
        return res.status(404).json({
          message: "Delivery service not available",
        });
      }
    } else {
      return res.status(404).json({
        message: "Pin code not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.addPinCode = async (req, res) => {
  const { pinCode, deliveryAvailable } = req.body;
  if (!pinCode || deliveryAvailable === undefined) {
    return res.status(400).json({
      message: "Pin code and delivery availability are required",
    });
  }
  try {
    const existingPinCode = await PinCode.findOne({
      pinCode,
    });
    if (existingPinCode) {
      return res.status(409).json({
        message: "This pin code already exists in the database",
      });
    }
    const newPinCode = new PinCode({
      pinCode,
      deliveryAvailable,
    });
    await newPinCode.save();
    return res.status(201).json({
      message: "Pin code added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getAllPinCodes = async (req, res) => {
  try {
    const pinCodes = await PinCode.find();
    if (pinCodes.length === 0) {
      return res.status(404).json({
        message: "No pin codes found in the database",
      });
    }
    return res.status(200).json(pinCodes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getPinCode = async (req, res) => {
  const { pinCode } = req.params;
  try {
    const pinCodeData = await PinCode.findOne({
      pinCode,
    });
    if (pinCodeData) {
      return res.status(200).json(pinCodeData);
    } else {
      return res.status(404).json({
        message: "Pin code not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.updatePinCode = async (req, res) => {
  const { pinCode } = req.params;
  const { deliveryAvailable } = req.body;

  if (deliveryAvailable === undefined) {
    return res.status(400).json({
      message: "Delivery availability is required",
    });
  }

  try {
    const pinCodeData = await PinCode.findOne({ pinCode });

    if (pinCodeData) {
      pinCodeData.deliveryAvailable = deliveryAvailable;
      await pinCodeData.save();
      return res.status(200).json({
        message: "Pin code updated successfully",
        pinCodeData,
      });
    } else {
      return res.status(404).json({
        message: "Pin code not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.deletePinCode = async (req, res) => {
  const { pinCode } = req.params;
  try {
    const result = await PinCode.findByIdAndDelete({
      pinCode,
    });
    if (result.deletedCount > 0) {
      return res.status(200).json({
        message: "Pin code deleted successfully",
      });
    } else {
      return res.status(404).json({
        message: "Pin code not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
