const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliveryBoySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  age: {
    type: Number,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ["motorcycle", "bicycle", "car", "van"],
    required: true,
  },
});

const DeliveryBoy = mongoose.model("DeliveryBoy", DeliveryBoySchema);

module.exports = DeliveryBoy;
