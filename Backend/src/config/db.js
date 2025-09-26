import mongoose from "mongoose";
import "dotenv/config";

const DB = process.env.MONGODB;
const connectDB = async () => {
  try {
    if (!DB) {
      throw new Error("Database url missing");
    }
    await mongoose.connect(DB);
    console.log("DataBase Connected");
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
