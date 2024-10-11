const express = require('express');
const router = express.Router();
const pinCodeController = require('../controllers/pinCodeController');

// Check Delivery Availability
router.post('/check-delivery', pinCodeController.checkDelivery);

// Add New Pin Code
router.post('/add-pin-code', pinCodeController.addPinCode);

// Get All Pin Codes
router.get('/pin-codes', pinCodeController.getAllPinCodes);

// Get Specific Pin Code Details
router.get('/pin-codes/:pinCode', pinCodeController.getPinCode);

// Update Pin Code
router.put('/pin-codes/:pinCode', pinCodeController.updatePinCode);

// Delete Pin Code
router.delete('/pin-codes/:pinCode', pinCodeController.deletePinCode);

module.exports = router;
