import jwt from "jsonwebtoken";
import userModel from "../models/user/userModel.js";


const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized : No token found" });
  }

  try {
    const parts = token.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ msg: "Malformed token" });
    }

    const decode = jwt.verify(parts[1], process.env.JWT_ACCESS_SECRET);
    req.user = await userModel.findById(decode.id);
    next();
  } catch (error) {
    console.error("Error in token verification:", error);
    return res.status(403).json({ msg: "Invalid or expired token" });
  }
};

export default authMiddleware;
