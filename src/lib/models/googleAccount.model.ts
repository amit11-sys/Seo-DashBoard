import mongoose, { Document, Model } from "mongoose";

interface IGoogleAccount extends Document {
  googleEmail: string;
  googleAccessToken: string;
  googleAccessTokenExpiry: number;
  googleRefreshToken: string;
  googleRefreshTokenExpiry: string;
  googleId_token: string;
}

const GoogleAccountSchema = new mongoose.Schema<IGoogleAccount>(
  {
    googleEmail: {type:String},
    googleAccessToken: { type: String },
    googleAccessTokenExpiry: { type: Number },
    googleRefreshToken: { type: String },
    googleRefreshTokenExpiry: { type: String },
    googleId_token: { type: String },
    
  },
  { timestamps: true }
);

const GoogleAccount: Model<IGoogleAccount> =
  mongoose.models.GoogleAccount ||
  mongoose.model<IGoogleAccount>("GoogleAccount", GoogleAccountSchema);

export default GoogleAccount;
