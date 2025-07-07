import mongoose from "mongoose";

const KeywordTrackingSchema = new mongoose.Schema(
  {
    type: { type: String },              // "organic"
    location_code: { type: Number },     // 2124
    language_code: { type: String },     // "en"
    url: { type: String },               // "https://www.handonawhiteboard.com/locations/toronto"
    rank_group: { type: Number },        // 2
    rank_absolute: { type: Number },     // 3
  },
  {
    timestamps: true,
  }
);

const KeywordTracking =
  mongoose.models.KeywordTracking || mongoose.model("KeywordTracking", KeywordTrackingSchema);

export default KeywordTracking;
