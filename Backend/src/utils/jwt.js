import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = {
  expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
};

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    ACCESS_TOKEN_EXPIRY
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};
