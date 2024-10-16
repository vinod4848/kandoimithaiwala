const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/adminUser");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    let adminUser = await AdminUser.findOne({ email });
    if (adminUser) {
      return res.status(400).json({ error: "Admin user already exists" });
    }
    adminUser = new AdminUser({
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    adminUser.password = await bcrypt.hash(password, salt);

    await adminUser.save();

    const payload = {
      adminUser: {
        id: adminUser.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET_ADMIN,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error("Error registering admin user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let adminUser = await AdminUser.findOne({ email });
    if (!adminUser) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const payload = {
      adminUser: {
        id: adminUser.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET_ADMIN,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token,adminUser });
      }
    );
  } catch (error) {
    console.error("Error logging in admin user:", error);
    res.status(500).json({ error: "Server error" });
  }
};
