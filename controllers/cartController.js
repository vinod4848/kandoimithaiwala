const Cart = require("../models/Cart");
const Product = require("../models/Product");


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


// const getCart = async (req, res) => {
//   const { userId } = req.params;

//   try {

//     const cart = await Cart.findOne({ userId }).populate({
//       path: 'items.productId.image ',
//       model: 'Product',
//       select: 'price name image', 
//     });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     // Calculate total price
//     let totalPrice = 0;
//     cart.items = cart.items.map((item) => {
//       if (item.productId && item.productId.price !== undefined) {
//         const itemTotalPrice = item.productId.price * item.quantity;
//         item.totalPrice = itemTotalPrice; 
//         totalPrice += itemTotalPrice;
//       } else {
//         console.warn(`Product ID: ${item.productId} does not have a valid price.`);
//       }
//       return item;
//     });


//     await cart.save();
//     res.status(200).json({
//       cart,
//       totalPrice, 
//     });
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Populate the productId field with its price, name, and image
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId', // Populate the productId field
      model: 'Product',
      select: 'price name images imageUrl', // Select the fields you need from Product
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate total price
    let totalPrice = 0;
    cart.items = cart.items.map((item) => {
      if (item.productId && item.productId.price !== undefined) {
        const itemTotalPrice = item.productId.price * item.quantity;
        item.totalPrice = itemTotalPrice; 
        totalPrice += itemTotalPrice;
      } else {
        console.warn(`Product ID: ${item.productId} does not have a valid price.`);
      }
      return item;
    });

    await cart.save();
    res.status(200).json({
      cart,
      totalPrice, 
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteCartProduct = async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    // Find the cart for the specific user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the specific item from the cart items using _id of the item
    const updatedItems = cart.items.filter(item => item._id.toString() !== itemId);

    // If the item was not found in the cart, return a message
    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the cart with the remaining items
    cart.items = updatedItems;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Item removed from cart successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
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
  deleteCartProduct,
  removeItemFromCart,
  clearCart,
  updateItemQuantity,
  getTotalPrice,
  getAllItems

};
