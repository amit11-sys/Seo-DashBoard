import { Schema, model, models } from "mongoose";

const shareLinkSchema = new Schema(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

const ShareLink = models.ShareLink || model("ShareLink", shareLinkSchema);

export default ShareLink;
