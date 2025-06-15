const User = require("../models/userModel");
const {generateAccessToken} = require('../utils/token');

//create account
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const payload = { id: user._id };
    const accessToken = generateAccessToken(payload);
    return res.status(200).json({
      message: "User logged in successfully.",
      admin: {
        email: user.email,
        id: user._id,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server error", error:error.message });
  }
};
