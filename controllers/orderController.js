const Order = require("../models/Order");
const Product = require("../models/Product");
const DeliveryBoy = require("../models/DeliveryBoy");


// const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       addressId,
//       cartItems,
//       name,
//       email,
//       phone,
//       paymentMode  
//     } = req.body;


//     const products = await Product.find({
//       _id: { $in: cartItems.map((item) => item.productIds) },
//     });

    
//     let totalPrice = cartItems.reduce((acc, item) => {
//       const product = products.find(
//         (p) => p._id.toString() === item.productIds
//       );
//       if (product) {
//         return acc + product.price * item.quantity;
//       }
//       return acc;
//     }, 0);

//     const gstAmount = (18 / 100) * totalPrice;
//     const deliveryCharge = 50;
//     totalPrice += gstAmount + deliveryCharge;

//     const order = new Order({
//       userId,
//       addressId,
//       cartItems,
//       totalPrice,
//       name,
//       email,
//       phone,
//       paymentMode,  
//       status: 'Processing',
//     });
//     await order.save();
//     res.status(201).json({
//       message: 'Order placed successfully!',
//       totalPrice: totalPrice,
//       gstAmount: gstAmount,
//       deliveryCharge: deliveryCharge,
//       orderId: order._id
//     });
//   } catch (error) {
//     console.error('Error during checkout:', error);
//     res.status(500).json({ message: 'Failed to place the order.' });
//   }
// };
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      addressId,
      cartItems,
      name,
      email,
      phone,
      paymentMode  
    } = req.body;

    const products = await Product.find({
      _id: { $in: cartItems.map((item) => item.productIds) },
    });

    // Log products and cartItems for debugging
    console.log('Cart Items:', cartItems);
    console.log('Products:', products);

    let totalPrice = cartItems.reduce((acc, item) => {
      const product = products.find(
        (p) => p._id.toString() === item.productIds.toString() // Ensure both sides are strings
      );

      // Log the found product
      console.log('Found Product:', product);

      if (product) {
        // Check if the price is a valid number
        if (typeof product.price !== 'number') {
          console.error(`Invalid price for product ID ${product._id}:`, product.price);
          return acc; // Skip adding this product if the price is invalid
        }
        return acc + product.price * item.quantity; // Add the calculated price for this item
      }
      console.warn(`Product not found for ID: ${item.productIds}`);
      return acc; // If product not found, just return the accumulator
    }, 0);

    // Ensure totalPrice is a valid number before further calculations
    if (isNaN(totalPrice)) {
      return res.status(400).json({ message: 'Invalid total price calculation.' });
    }

    const gstAmount = (18 / 100) * totalPrice;
    const deliveryCharge = 50;
    totalPrice += gstAmount + deliveryCharge;

    const order = new Order({
      userId,
      addressId,
      cartItems,
      totalPrice,
      name,
      email,
      phone,
      paymentMode,  
      status: 'Processing',
    });
    await order.save();
    res.status(201).json({
      message: 'Order placed successfully!',
      totalPrice: totalPrice,
      gstAmount: gstAmount,
      deliveryCharge: deliveryCharge,
      orderId: order._id
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Failed to place the order.' });
  }
};


const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId })
      .populate({
        path: "cartItems.productIds",
        model: "Product",
      })
      .populate("addressId");
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};

const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "Accepted" },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error accepting order:", error);
    res.status(500).json({ error: "Failed to accept order." });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 }).populate("userId");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const updateOrderStatus = async (req, res) => {

  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status." });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res
      .status(200)
      .json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete Order" });
  }
};

const assignOrderToDeliveryBoy = async (req, res) => {
  try {
    const { deliveryBoyId, orderId } = req.body;

    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) {
      return res.status(404).json({ message: "Delivery Boy not found" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    deliveryBoy.orders.push(orderId);
    await deliveryBoy.save();
    res
      .status(200)
      .json({ message: "Order assigned to Delivery Boy successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'Cancelled' },
      { new: true }  
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order cancelled successfully!',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order.' });
  }
};




const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { name, email, phone } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }


    order.name = name;
    order.email = email;
    order.phone = phone;


    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order." });
  }
};
module.exports = {
  updateOrder,
  assignOrderToDeliveryBoy,
  getAllOrders,
  acceptOrder,
  cancelOrder,
  updateOrderStatus,
  deleteOrder,
  createOrder,
  getOrdersByUser,
};
