const express = require("express");
const router = express.Router();
const {
  addDeliveryBoy,
  getDeliveryboybyId,
  getAllDeliveryBoy,
  updateDeliveyBoy,
  deleteDeliveyBoy,
} = require("../controllers/deliveryBoyController");

router.post("/addDeliveryBoy", addDeliveryBoy);
router.get("/getDeliveryboybyId/:id", getDeliveryboybyId);
router.get("/getAllDeliveryBoy", getAllDeliveryBoy);
router.put("/updateDeliveyBoy/:id", updateDeliveyBoy);
router.delete("/deleteDeliveyBoy/:id", deleteDeliveyBoy);

module.exports = router;
