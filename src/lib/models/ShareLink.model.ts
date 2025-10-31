import mongoose, { Schema, model, models } from "mongoose";

const shareLinkSchema = new Schema(
  {
    campaignId: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true }
    ],
    token: { type: String, required: true, unique: true }, // ✅ required + unique
    userId: { type: String, required: true }, // ✅ required
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

const ShareLink = models.ShareLink || model("ShareLink", shareLinkSchema);

export default ShareLink;
