import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: String,
    status: { type: String, enum: ["active", "completed"], default: "active" },
  },
  { timestamps: true }
);

const projectModel =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
export default projectModel;
