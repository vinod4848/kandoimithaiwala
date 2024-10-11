const Product = require("../models/Product");
const { uploadImage } = require("../helper/uploadImage");

const createProduct = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    } 
    const image = await uploadImage(file);

    const product = new Product({ ...req.body, image });
    await product.save();

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, quantity } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, imageUrl, quantity },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("updatedProduct -- id", id);
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("productCategoryId");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { searchQuery, minPrice, maxPrice, category, sortBy, sortOrder } = req.query;
    let filters = {};

    if (searchQuery) {
      filters.name = new RegExp(searchQuery, "i");
    }

    if (minPrice) {
      filters.price = { ...filters.price, $gte: minPrice };
    }

    if (maxPrice) {
      filters.price = { ...filters.price, $lte: maxPrice };
    }

    if (category) {
      filters.productCategoryId = category;
    }

    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const products = await Product.find(filters).sort(sortOptions);
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("productCategoryId");
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
module.exports = {
  getAllProducts,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
