import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: String,
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    dueDate: Date,
  },
  { timestamps: true }
);

const taskModel = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default taskModel;
