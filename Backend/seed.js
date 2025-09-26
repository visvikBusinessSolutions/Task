import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "./src/models/userModel.js";
import taskModel from "./src/models/taskModel.js";
import projectModel from "./src/models/projectModel.js";

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    await Promise.all([
      userModel.deleteMany(),
      projectModel.deleteMany(),
      taskModel.deleteMany(),
    ]);

    const user = await userModel.create({
      username: "Test User",
      email: "test@example.com",
      password: await bcrypt.hash("Test® 123", 10),
    });

    for (let i = 1; i <= 2; i++) {
      const project = await projectModel.create({
        user: user._id,
        title: `Demo Project ${i}`,
        description: `Seeded project ${i}`,
      });

      for (let j = 1; j <= 3; j++) {
        await taskModel.create({
          project: project._id,
          title: `Task ${j} for project ${i}`,
          description: `Auto seeded task ${j}`,
          dueDate: new Date(Date.now() + j * 86400000),
        });
      }
    }
    console.log("✅ Database seeded");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
