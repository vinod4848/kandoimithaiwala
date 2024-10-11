const Cart = require("../models/Cart");
const Product = require("../models/Product");

// const addItemToCart = async (req, res) => {
//   const { userId, productIds, quantity } = req.body;

//   // Input validation
//   if (!userId || !Array.isArray(productIds) || productIds.length === 0 || !quantity) {
//     return res.status(400).json({ message: "Invalid input data" });
//   }

//   try {
//     // Find the user's cart or create a new one if it doesn't exist
//     let cart = await Cart.findOne({ userId });
//     if (!cart) {
//       cart = new Cart({ userId, items: [] });
//     }

//     // Validate products
//     const products = await Product.find({ _id: { $in: productIds } });
//     if (products.length !== productIds.length) {
//       return res.status(404).json({ message: "Some products not found" });
//     }

//     // Loop through productIds and add to cart
//     for (const productId of productIds) {
//       const existingItem = cart.items.find(item => item.productId.toString() === productId);
//       if (existingItem) {
//         existingItem.quantity += quantity; // Update existing item's quantity
//       } else {
//         cart.items.push({ productId, quantity }); // Add new item
//       }
//     }

//     await cart.save();
//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// const getCart = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const cart = await Cart.findOne({ userId }).populate('items.productId');
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     // Calculate total price
//     const totalPrice = cart.items.reduce((total, item) => {
//       return total + (item.productId.price * item.quantity);
//     }, 0);

//     // Respond with cart and total price
//     res.status(200).json({
//       cart,
//       totalPrice
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const addItemToCart = async (req, res) => {
  const { userId, items } = req.body;

  // Input validation
  if (!userId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    let cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Loop through items and add to cart
    items.forEach(({ productId, quantity, variant }) => {
      const existingItem = cart.items.find((item) => {
        const arr1Filtered = item?.variant?.map(({ title, price }) => ({
          title,
          price,
        }));
        return (
          item.productId._id.toString() === productId &&
          JSON.stringify(arr1Filtered) === JSON.stringify(variant)
        );
      });
      console.log(existingItem);

      // Ensure variants are handled and calculate total price properly
      const totalPrice =
        variant && Array.isArray(variant)
          ? variant.reduce((a, b) => a + b.price, 0) * quantity
          : 0;

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice += totalPrice;
      } else {
        cart.items.push({ productId, quantity, variant, totalPrice }); // Add new item
      }
    });

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// const getCart = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const cart = await Cart.findOne({ userId }).populate('items.productId');
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     // Calculate total price
//     let totalPrice = 0;
//     cart.items.forEach((item) => {
//       if (item.productId && item.productId.price !== undefined) {
//         const itemTotalPrice = item.productId.price * item.quantity;
//         item.totalPrice = itemTotalPrice;
//         totalPrice += itemTotalPrice;
//       } else {
//         console.warn(`Product ID: ${item.productId} does not have a valid price.`);
//       }
//     });

//     // Save the updated cart if you modified item totalPrices
//     await cart.save();

//     // Respond with cart and total price
//     res.status(200).json({
//       cart,
//       totalPrice // This is the calculated total price
//     });
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Populate the items array to include product information (e.g., price)
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      model: 'Product',
      select: 'price name', // Ensure price is included in the population
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate total price
    let totalPrice = 0;
    cart.items = cart.items.map((item) => {
      if (item.productId && item.productId.price !== undefined) {
        const itemTotalPrice = item.productId.price * item.quantity;
        item.totalPrice = itemTotalPrice; // Update the item with the correct total price
        totalPrice += itemTotalPrice;
      } else {
        console.warn(`Product ID: ${item.productId} does not have a valid price.`);
      }
      return item;
    });

    // Save the updated cart if any item's `totalPrice` has been modified
    await cart.save();

    // Respond with cart and total price
    res.status(200).json({
      cart,
      totalPrice, // This is the calculated total price
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



const removeItemFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const clearCart = async (req, res) => {
  const { userId } = req.body;

  try {
    await Cart.deleteOne({ userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const updateItemQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the item's quantity
    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const getTotalPrice = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate total price
    const totalPrice = cart.items.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);

    res.status(200).json({ totalPrice });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const getAllItems = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = {
  addItemToCart,
  getCart,
  removeItemFromCart,
  clearCart,
  updateItemQuantity,
  getTotalPrice,
  getAllItems

};
