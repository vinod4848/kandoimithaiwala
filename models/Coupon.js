const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    couponcode: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    titel: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    maxUses: {
      type: Number,
      default: null,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

couponSchema.pre("save", async function (next) {
  try {
    if (!this.couponcode) {
      const uniqueCouponCode = await generateUniqueCouponCode();
      this.couponcode = uniqueCouponCode;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;

async function generateUniqueCouponCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let couponCode = "";
  for (let i = 0; i < 8; i++) {
    couponCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  const existingCoupon = await Coupon.findOne({ couponcode: couponCode });
  if (existingCoupon) {
    return generateUniqueCouponCode();
  }
  return couponCode;
}
