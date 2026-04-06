import mongoose from "mongoose";
import Task from "./Task.js";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true },
);

// Index for faster queries
projectSchema.index({ owner: 1 });

// Cascade delete tasks when project is deleted
projectSchema.pre("findOneAndDelete", async function (next) {
  const project = await this.model.findOne(this.getFilter());
  if (project) {
    await Task.deleteMany({ project: project._id });
  }
  next();
});

export default mongoose.model("Project", projectSchema);
