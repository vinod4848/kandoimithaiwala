const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/order", orderController.createOrder);

router.get("/order/:userId", orderController.getOrdersByUser);

router.get("/order", orderController.getAllOrders);

router.put("/order/:orderId", orderController.updateOrderStatus);

router.put("/updateOrder/:orderId", orderController.updateOrder);

router.put("/acceptOrder/:orderId", orderController.acceptOrder);

router.put("/assignOrderToDeliveryBoy",orderController.assignOrderToDeliveryBoy);

router.delete("/order/:orderId", orderController.deleteOrder);

router.put("/cancel/:orderId", orderController.cancelOrder);

module.exports = router;
