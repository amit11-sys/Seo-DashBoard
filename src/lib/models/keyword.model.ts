import mongoose from "mongoose";
import { number } from "zod";

const keywordSchema = new mongoose.Schema(
  {
    keywords: { type: String },
    SearchEngine: { type: String },
    deviceType: { type: String },
    keywordTag: { type: String },
    language: { type: String },
    name: { type: String },
    searchLocationCode: { type: String },
    date : { type: String },
    serpType: { type: String },
    url: { type: String },
    volumeLocationCode: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    CampaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    keywordId: { type: String },

    status: {
      type: Number,

      default: 1,
    },
  },

  {
    timestamps: true,
  }
);

const Keyword =
  mongoose.models.Keyword || mongoose.model("Keyword", keywordSchema);
// mongoose.model("Keyword", keywordSchema);
export default Keyword;
