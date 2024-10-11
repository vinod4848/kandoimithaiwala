const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const serverless = require("serverless-http");

const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const couponRoutes = require("./routes/couponRouter");
const categoryRoutes = require("./routes/productCategoryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const aboutUsRoutes = require("./routes/aboutUsRoutes");
const bookingRoutes = require("./routes/bookingTableRoutes");
const deliveryboyRoutes = require("./routes/deliveryBoyRoutes");
const addressRoutes = require("./routes/addressRoutes");
const pincodeRoutes = require("./routes/PinCodeRoutes");

dotenv.config(); 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pincode", pincodeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/about", aboutUsRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/deliveryboy", deliveryboyRoutes);
app.use("/api/addresses", addressRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV || "development"} mode`
  );
  console.log(`App is listening on port ${PORT}`);
});

module.exports.api = serverless(app);
