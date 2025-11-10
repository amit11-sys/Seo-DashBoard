import mongoose from "mongoose";
const subTodoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedAt: { type: Date, default: Date.now },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    assignedAt: { type: Date, default: Date.now },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      default: "pending",
    },
    isTempDisabled: {
      type: Boolean,
      default: false,
    },

    subtodo: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);
export default Todo;