const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const productCategoryController = require("../controllers/productCategoryController");

router.post("/category",  upload.single("image"), productCategoryController.createProductCategory);

router.get("/category", productCategoryController.getAllProductCategories);

router.put("/category/:id",upload.single("image"),  productCategoryController.updateProductCategory);

router.get("/getProductCategoryById/:id", productCategoryController.getProductCategoryById);

router.delete("/category/:id", productCategoryController.deleteProductCategory);

module.exports = router;
