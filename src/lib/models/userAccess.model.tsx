import mongoose from "mongoose";
const userAccessSchema = new mongoose.Schema(
  {
campaignId: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }
    ],    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    permissions: {
      view: { type: Boolean, default: true },
      edit: { type: Boolean, default: false },
    },
    assignedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
const UserAccess =
  mongoose.models.UserAccess || mongoose.model("UserAccess", userAccessSchema);
export default UserAccess;