import mongoose from "mongoose";

const authTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    accessToken:{ type: String, required: true, unique: true },
    refreshToken:{ type: String, required: true, unique: true },
    expiresAt:{type:Number, default:60}
  },
  {
    timestamps: true,
  }
);

const authToken =
  mongoose.models.authToken || mongoose.model("auth-token", authTokenSchema);
export default authToken;
