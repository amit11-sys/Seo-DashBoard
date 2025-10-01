import mongoose, { Document, Model } from "mongoose";

interface IKeywordTracking extends Document {
  type?: string;
  location_code: number;
  language_code?: string;
  url?: string;
  keywordTag?: string;
  rank_group: number;
  rank_absolute?: number;
  keyword?: string;
  location_name?: string;
  searchVolumn?: number;
  intent?: string;
  competition?: number;
  start?: number;
  checkUrl?: string;
  keywordsUp?: number;
  userId:mongoose.Schema.Types.ObjectId;
  top3?: number;
  top10?: number;
  top20?: number;
  top30?: number;
  top100?: number;
  campaignId?: mongoose.Schema.Types.ObjectId;
  keywordId?: mongoose.Schema.Types.ObjectId;
  status?: number;
   // 🔥 New fields for rank tracking
  rankChange?: number; // how many positions moved
  changeDirection?: "up" | "down"; // direction of movement
  lastUpdatedAt?: Date;
  
  
}

const KeywordTrackingSchema = new mongoose.Schema<IKeywordTracking>(
  {
    type: { type: String },
    location_code: { type: Number },
    language_code: { type: String },
    url: { type: String },
    keywordTag: { type: String },
    rank_group: { type: Number },
    rank_absolute: { type: Number },
    keyword: { type: String },
    location_name: { type: String },
    searchVolumn: { type: Number },
    intent: { type: String },
    competition: { type: Number },
    start: { type: Number },
    checkUrl: { type: String },
    keywordsUp: { type: Number },
    top3: { type: Number },
    top10: { type: Number },
    top20: { type: Number },
    top30: { type: Number },
    top100: { type: Number },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    keywordId: { type: mongoose.Schema.Types.ObjectId, ref: "Keyword" },
     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, default: 1 },
       // 🔥 New fields inside schema
    rankChange: { type: Number, default: null },
    changeDirection: { type: String, enum: ["up", "down", null], default: null },
    lastUpdatedAt: { type: Date, default: null } // new field

   
  },
   { timestamps: true }
);

const KeywordTracking: Model<IKeywordTracking> =
  mongoose.models.KeywordTracking ||
  mongoose.model<IKeywordTracking>("KeywordTracking", KeywordTrackingSchema);

export default KeywordTracking;
