import mongoose from "mongoose";
import { string } from "zod";

const KeywordTrackingSchema = new mongoose.Schema(
  {
    type: { type: String },              // "organic"
    location_code: { type: Number },     // 2124
    language_code: { type: String },     // "en"
    url: { type: String },               // "https://www.handonawhiteboard.com/locations/toronto"
    rank_group: { type: Number },        // 2
    rank_absolute: { type: Number },
    keyword: { type: String },
    location_name: { type: String } ,    // 3
    // campaignId: { type: String},
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign"},
  },
  { 
    timestamps: true, 
  }  
);

const KeywordTracking =
  mongoose.models.KeywordTracking || mongoose.model("KeywordTracking", KeywordTrackingSchema);

export default KeywordTracking;
