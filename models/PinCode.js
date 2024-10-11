const mongoose = require('mongoose');

const pinCodeSchema = new mongoose.Schema({
    pinCode: { type: String, required: true, unique: true },
    deliveryAvailable: { type: Boolean, required: true },
});

module.exports = mongoose.model('PinCode', pinCodeSchema);
