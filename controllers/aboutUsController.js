const AboutUs = require("../models/AboutUs");

exports.createAboutUs = async (req, res) => {
  try {
    const aboutUs = new AboutUs(req.body);
    await aboutUs.save();
    res.status(201).json(aboutUs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      return res.status(404).json({ error: "About us details not found" });
    }
    res.status(200).json(aboutUs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAboutUsById = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findById(req.params.id);
    if (!aboutUs) {
      return res.status(404).json({ error: "About us details not found" });
    }
    res.status(200).json(aboutUs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOneAndUpdate({}, req.body, { new: true });
    if (!aboutUs) {
      return res.status(404).json({ error: "About us details not found" });
    }
    res.status(200).json(aboutUs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAboutUs = async (req, res) => {
  try {
    await AboutUs.deleteOne();
    res.status(200).json({ message: "About us details deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};