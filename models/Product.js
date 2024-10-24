const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  variants: [{ 
    quantity: { type: String, required: true }, 
    price: { type: Number, required: true } 
  }],
  offerPrice: {
    type: Number,
  },
  images: {
    type: [String],  
  },
  
  productCategoryId: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory" }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
