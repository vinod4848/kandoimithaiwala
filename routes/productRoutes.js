const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const productController= require("../controllers/productController");

router.post("/createProduct", upload.array("images"), productController.createProduct);

router.get("/getAllProducts", productController.getAllProducts);

router.delete("/products/:productId/:imageIndex",productController.deleteProductImageByIndex);

router.get("/getProductById/:id", productController.getProductById);

router.get('/category/:categoryId',productController.getProductsByCategory);

router.delete('/product/:productId/variant/:variantId', productController.deleteProductVariantById);

router.put('/updateProductVariant/:productId/:variantId', productController.updateProductVariantById);

router.get("/search", productController.searchProducts);


router.put("/updateProduct/:id", upload.array("images"), productController.updateProduct);


router.delete("/deleteProduct/:id", productController.deleteProduct);

module.exports = router;
