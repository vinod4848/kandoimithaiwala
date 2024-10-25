const Product = require("../models/Product");
const { uploadImage ,deleteImage} = require("../helper/uploadImage");

const createProduct = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Image files are required" });
    }

    // Map through the files and upload each one
    const imageUrls = await Promise.all(files.map(file => uploadImage(file)));

    const product = new Product({ ...req.body, images: imageUrls });
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
    const updates = { ...req.body }; // Collect the product updates from the request body
    const files = req.files; // Check if multiple image files are uploaded

    // If image files are provided, upload each and gather their URLs
    if (files && files.length > 0) {
      console.log("Image files found, uploading...");
      const imageUrls = await Promise.all(files.map(file => uploadImage(file))); // Upload each file and get the URLs
      updates.images = imageUrls; // Add the image URLs to the update object
    }

    // Find the product by ID and update its details
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("productCategoryId");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
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
    const { searchQuery, minPrice, maxPrice, category, sortBy, sortOrder } =
      req.query;
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
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const products = await Product.find(filters).sort(sortOptions);
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({
      productCategoryId: categoryId,
    }).populate("productCategoryId");

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).json({ message: "Failed to fetch products by category" });
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

const deleteProductVariantById = async (req, res) => {
  const { productId, variantId } = req.params;

  try {
    // Find the product and remove the variant with the specified variant ID
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $pull: { variants: { _id: variantId } },
      },
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product or variant not found" });
    }

    res.status(200).json({
      message: "Variant deleted successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error deleting variant:", error);
    res.status(500).json({ message: "Error deleting variant", error });
  }
};

const updateProductVariantById = async (req, res) => {
  const { productId, variantId } = req.params;
  const variantUpdates = req.body; // New data to update the variant

  try {
    // Find the product by ID and update the specific variant
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, "variants._id": variantId },
      {
        $set: {
          "variants.$": variantUpdates, // Update the specific variant data
        },
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product or variant not found" });
    }

    res.status(200).json({
      message: "Variant updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating variant:", error);
    res.status(500).json({ message: "Error updating variant", error });
  }
};

const deleteProductImageByIndex = async (req, res) => {
  const { productId, imageIndex } = req.params; // Get product ID and image index from params

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the image index is valid
    if (imageIndex < 0 || imageIndex >= product.images.length) {
      return res.status(400).json({ message: "Invalid image index" });
    }

    // Get the URL of the image to delete
    const imageUrl = product.images[imageIndex];

    // Remove the image from the array
    product.images.splice(imageIndex, 1);

    // Update the product in the database
    await product.save();

    // Optionally, delete the image from storage
    await deleteImage(imageUrl); // Call a helper function to delete the image from storage

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Error deleting product image:", error);
    res.status(500).json({ message: "Error deleting image", error });
  }
};

module.exports = {
  getAllProducts,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  deleteProductVariantById,
  updateProductVariantById,
  deleteProductImageByIndex,
};
