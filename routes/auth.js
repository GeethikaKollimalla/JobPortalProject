const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("Auth Route Working");
});
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.Middleware");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

const salt = await bcrypt.genSalt(10);
const hashedPassword = await 
bcrypt.hash(password, salt);
const user = new User({
    name,
    email,
    password: hashedPassword,
});
    await user.save();

    res.status(201).json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login Successful",
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
router.get("/profile", authMiddleware, async (req, res) => {
        const user = await User.findById(req.user.id).select(
            "-password");
            res.json(user);
        }
);

module.exports = router;