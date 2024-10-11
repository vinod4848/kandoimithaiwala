const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.post("/contact", contactController.createContact);

router.get("/contact", contactController.getAllContacts);

router.get("/contact/:id", contactController.getContactById);

router.put("/contact/:id", contactController.updateContact);

router.delete("/contact/:id", contactController.deleteContact);

module.exports = router;
