import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB = process.env.MONGODB; // fallback
const connectDB = async () => {
  try {
    if (!DB) {
      throw new Error("Database url missing");
    }
    await mongoose.connect(DB);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
