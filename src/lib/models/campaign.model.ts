import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    campaignName: { type: String, required: true },
    projectUrl: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
