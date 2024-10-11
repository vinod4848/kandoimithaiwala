const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/booking", bookingController.createBooking);

router.get("/getAllbooking", bookingController.getAllBookings);

router.get("/getBookingById/:bookingId", bookingController.getBookingById);

router.put("/updateBooking/:bookingId", bookingController.updateBookingById);

router.delete("deleteBooking/:bookingId", bookingController.deleteBookingById);

router.get("/myBooking/:userId", bookingController.getBookingsByUserId);

module.exports = router;
