import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from "./src/routes/authRoutes.js";
import projectRouter from "./src/routes/projectRoutes.js";
import taskRouter from "./src/routes/taskRouter.js";


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/v1/user/auth", authRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/task", taskRouter);

app.use((err, _req, res, _next) =>
  res.status(err.status || 500).json({ message: err.message || "Server error" })
);

export default app;
