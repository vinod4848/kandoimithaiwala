const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");

router.post("/coupon", couponController.createCoupon);
router.get("/coupon", couponController.getAllCoupons);
router.get("/coupon/:id", couponController.getCouponById);
router.put("/coupon/:id", couponController.updateCoupon);
router.delete("/coupon/:id", couponController.deleteCoupon);

module.exports = router;
