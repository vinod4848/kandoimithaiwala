const Coupon = require("../models/Coupon");

const createCoupon = async (req, res) => {
  try {
    const couponData = req.body;
    const newCoupon = new Coupon(couponData);
    await newCoupon.save();
    res
      .status(201)
      .json({ message: "Coupon created successfully", data: newCoupon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ data: coupon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({ data: coupons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Coupon updated successfully", data: updatedCoupon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createCoupon,
  getCouponById,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};
