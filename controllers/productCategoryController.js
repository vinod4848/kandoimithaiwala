const ProductCategory = require("../models/productCategory");

const createProductCategory = async (req, res) => {
  try {
    const { productCategory } = req.body;
    const newCategory = new ProductCategory({ productCategory });
    await newCategory.save();
    res
      .status(201)
      .json({
        message: "Product category created successfully",
        data: newCategory,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProductCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find();
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { productCategory } = req.body;
    const updatedCategory = await ProductCategory.findByIdAndUpdate(
      id,
      { productCategory },
      { new: true }
    );
    res
      .status(200)
      .json({
        message: "Product category updated successfully",
        data: updatedCategory,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductCategory.findByIdAndDelete(id);
    res.status(200).json({ message: "Product category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const productCategory = await ProductCategory.findById(id);

    if (!productCategory) {
      return res.status(404).json({ message: "ProductCategory not found" });
    }

    res.status(200).json(productCategory);
  } catch (err) {
    console.error("Error fetching productCategory:", err);
    res.status(500).json({ message: "Failed to fetch productCategory" });
  }
};
module.exports = {
  createProductCategory,
  getProductCategoryById,
  getAllProductCategories,
  updateProductCategory,
  deleteProductCategory,
};
