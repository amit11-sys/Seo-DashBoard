import mongoose from "mongoose";

const keywordSchema = new mongoose.Schema(
  {
    keywords: { type: String },
    SearchEngine: { type: String },
    deviceType: { type: String },
    keywordTag: { type: String },
    language: { type: String },
    name: { type: String },
    searchLocation: { type: String },
    serpType: { type: String },
    url: { type: String },
    volumeLocation: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    CampaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign"  },
  },

  {
    timestamps: true,
  }
);

const Keyword =
  mongoose.models.Keyword || mongoose.model("Keyword", keywordSchema);
// mongoose.model("Keyword", keywordSchema);
export default Keyword;
