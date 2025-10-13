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
    googleAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoogleAccount",
    },
    gaPropertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoogleProperty",
    },
    gscSiteId: { type: mongoose.Schema.Types.ObjectId, ref: "GoogleSites" },
  },
  {
    timestamps: true,
  }
);

const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
export default Campaign;
