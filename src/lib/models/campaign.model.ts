import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    campaignName: { type: String, required: true },
    projectUrl: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    total: { type: Number, default: 0 },
    processed: { type: Number, default: 0 },
    done: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now },
    status: {
      type: Number,

      default: 1,
    },
    googleAccessToken: { type: String },
    googleAccessTokenExpiry: { type: Number },
    googleRefreshToken: { type: String },
    googleRefreshTokenExpiry: { type: Number },
    googleId_token: { type: String },
  },
  {
    timestamps: true,
  }
);

const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
export default Campaign;
