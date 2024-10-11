const express = require("express");
const router = express.Router();
const productCategoryController = require("../controllers/productCategoryController");

router.post("/category", productCategoryController.createProductCategory);

router.get("/category", productCategoryController.getAllProductCategories);

router.put("/category/:id", productCategoryController.updateProductCategory);

router.get("/getProductCategoryById/:id", productCategoryController.getProductCategoryById);

router.delete("/category/:id", productCategoryController.deleteProductCategory);

module.exports = router;
