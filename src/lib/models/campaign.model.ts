import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    campaignName: { type: String, required: true },
    projectUrl: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    googleAccessToken: { type: String },
    googleAccessTokenExpiry: { type: String },
    googleRefreshToken: { type: String },
    googleRefreshTokenExpiry: { type: String },
    googleId_token: { type: String },
    propertyId: { type: String },
    status: {
      type: Number,

      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
export default Campaign;
