import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    msgTitle: { type: String, required: true },
    msgDescription: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    PostedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
