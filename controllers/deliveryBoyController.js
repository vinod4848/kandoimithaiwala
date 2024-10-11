const DeliveryBoy = require("../models/DeliveryBoy");

const addDeliveryBoy = async (req, res) => {
  try {
    const deliveryboydata = req.body;
    const newdeliveryboy = new DeliveryBoy(deliveryboydata);
    await newdeliveryboy.save();
    res.status(201).json({
      message: "Deliveryboy added successfully",
      data: newdeliveryboy,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getDeliveryboybyId = async (req, res) => {
//   try {
//     const delivery = await DeliveryBoy.findById(req.params.id).populate("orders")
//     .populate({
//       path: "cartItems.productIds",
//       model: "Product"});
//     if (!delivery) {
//       return res.status(404).json({ message: "Delivery Boy not found" });
//     }
//     res.status(200).json({ data: delivery });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getDeliveryboybyId = async (req, res) => {
  try {
    const delivery = await DeliveryBoy.findById(req.params.id)
      .populate("orders")
      .populate({
        path: "cartItems.productIds",
        model: "Product",
      });

    if (!delivery) {
      return res.status(404).json({ message: "Delivery Boy not found" });
    }

    res.status(200).json({ data: delivery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllDeliveryBoy = async (req, res) => {
  try {
    const deliveryboys = await DeliveryBoy.find();
    res.status(200).json({ data: deliveryboys });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDeliveyBoy = async (req, res) => {
  try {
    const updatedDeliveryBoy = await DeliveryBoy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Deliveryboy profile updated successfully",
      data: updatedDeliveryBoy,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDeliveyBoy = async (req, res) => {
  try {
    const deletedDeliveryBoy = await DeliveryBoy.findByIdAndDelete(
      req.params.id
    );
    if (!deletedDeliveryBoy) {
      return res.status(404).json({ message: "DeliveryBoy not found" });
    }
    res.status(200).json({ message: "DeliveryBoy deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  addDeliveryBoy,
  getDeliveryboybyId,
  getAllDeliveryBoy,
  updateDeliveyBoy,
  deleteDeliveyBoy,
};
