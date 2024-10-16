const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByCategory,
} = require("../controllers/productController");

router.post("/createProduct",upload.single("image"), createProduct);

router.get("/getAllProducts", getAllProducts);


router.get("/getProductById/:id", getProductById);

router.get('/category/:categoryId',getProductsByCategory);



router.get("/search", searchProducts);


router.put("/updateProduct/:id", updateProduct);


router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;
