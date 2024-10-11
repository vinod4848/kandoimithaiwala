const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema({
  productCategory: {
    type: String,
    required: true,
    unique: true,
  },
  date: { type: Date, default: Date.now, required: true },
});

const ProductCategory = mongoose.model(
  "ProductCategory",
  productCategorySchema
);

module.exports = ProductCategory;
