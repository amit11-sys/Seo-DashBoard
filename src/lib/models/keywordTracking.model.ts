import mongoose from "mongoose";

const KeywordTrackingSchema = new mongoose.Schema(
  {
    type: { type: String }, // "organic"
    location_code: { type: Number }, // 2124
    language_code: { type: String },
    url: { type: String },
    keywordTag: { type: String }, // 
    rank_group: { type: Number }, // 2
    rank_absolute: { type: Number },
    keyword: { type: String },
    location_name: { type: String }, // 3
     searchVolumn: { type: Number },
     intent:{ type: String },
     competition: { type: Number },
     start:{ type: Number },
    //  competition: { type: Number },
    //  intent: { type: String },
    // SearchEngine:{ type: String },
    // language :  { type: String }, // "en"
    // deviceType: { type: String },
    // campaignId: { type: String},
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    keywordId: { type: mongoose.Schema.Types.ObjectId, ref: "Keyword" },
    status: {
      type: Number,

      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const KeywordTracking =
  mongoose.models.KeywordTracking ||
  mongoose.model("KeywordTracking", KeywordTrackingSchema);

export default KeywordTracking;
