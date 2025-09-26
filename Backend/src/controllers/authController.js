import userModel from "../models/user/userModel.js";
import { generateAccessToken } from "../utils/jwt.js";

export const userRegister = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Name,Email and password are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    const user = await userModel.create({ username, email, password });

    res.status(201).json({
      success: true,
      msg: "User registered. Please proceed to login.",
      userId: user._id,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, msg: error.message });
    }
    res.status(500).json({ success: false, msg: "Internal server error." });
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const token = generateAccessToken(user._id);
    res
      .status(200)
      .json({ success: true, msg: "User logged in successfully", token, user });
  } catch (error) {
    next(error);
  }
};
