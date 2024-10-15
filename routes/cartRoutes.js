const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController"); 

router.post("/addToCart", cartController.addItemToCart);


router.get("/User/:userId", cartController.getCart);

router.delete("/cart/:userId/itemId/:itemId",cartController.deleteCartProduct);


router.delete("/remove", cartController.removeItemFromCart);


router.delete("/clear", cartController.clearCart);


router.put("/update", cartController.updateItemQuantity);

router.get("/total/:userId", cartController.getTotalPrice);


router.get("/cart/items/:userId", cartController.getAllItems);

module.exports = router;
