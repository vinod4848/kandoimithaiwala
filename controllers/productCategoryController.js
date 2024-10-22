const ProductCategory = require("../models/productCategory");
const { uploadImage } = require("../helper/uploadImage");
const createProductCategory = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }
    const image = await uploadImage(file);

    const productCategory = new ProductCategory({ ...req.body, image });
    await productCategory.save();

    res.status(201).json({ success: true, data: productCategory });
  } catch (error) {
    console.error("Error creating productCategory:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body }; // Collect the product updates from the request body
    const file = req.file; // Check if an image file is uploaded

    // If an image file is provided, upload and update the image
    if (file) {
      console.log("Image file found, uploading...");
      const imageUrl = await uploadImage(file); // Upload the image and get the URL
      updates.image = imageUrl; // Add the image URL to the update object
    }

    // Find the product by ID and update its details
    const updateProductCategory = await ProductCategory.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updateProductCategory) {
      return res.status(404).json({ message: "ProductCategory not found" });
    }

    res.status(200).json({ success: true, data: updateProductCategory });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update product",
        error: error.message,
      });
  }
};

// const createProductCategory = async (req, res) => {
//   try {
//     const { productCategory } = req.body;
//     const newCategory = new ProductCategory({ productCategory });
//     await newCategory.save();
//     res
//       .status(201)
//       .json({
//         message: "Product category created successfully",
//         data: newCategory,
//       });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getAllProductCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find();
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const updateProductCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { productCategory } = req.body;
//     const updatedCategory = await ProductCategory.findByIdAndUpdate(
//       id,
//       { productCategory },
//       { new: true }
//     );
//     res
//       .status(200)
//       .json({
//         message: "Product category updated successfully",
//         data: updatedCategory,
//       });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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
