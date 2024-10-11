const express = require("express");
const router = express.Router();
const aboutUsController = require("../controllers/aboutUsController");

router.post("/createAboutUs", aboutUsController.createAboutUs);

router.get("/getAllAboutUs", aboutUsController.getAboutUs);

router.put("/updateAboutUs/:id", aboutUsController.updateAboutUs);

router.get("/getByIdAboutUs/:id", aboutUsController.getAboutUsById);

router.delete("/deleteAboutUs/:id", aboutUsController.deleteAboutUs);

module.exports = router;
