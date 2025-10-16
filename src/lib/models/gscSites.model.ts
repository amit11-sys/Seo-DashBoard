import mongoose, { Document, Model, ObjectId } from "mongoose";

export enum PermissionLevel {
  SiteOwner = "siteOwner",
  SiteFullUser = "siteFullUser",
  SiteRestrictedUser = "siteRestrictedUser",
}
interface IGoogleSites extends Document {
  siteUrl: string;
  permissionLevel: PermissionLevel;
  googleAccountId: ObjectId;
}
const GoogleSitesSchema = new mongoose.Schema<IGoogleSites>(
  {
    siteUrl: { type: String },
    permissionLevel: {
      type: String,
      enum: Object.values(PermissionLevel),
      required: true,
    },
    googleAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoogleAccount",
    },
  },
  { timestamps: true }
);

const GoogleSites: Model<IGoogleSites> =
  mongoose.models.GoogleSites ||
  mongoose.model<IGoogleSites>("GoogleSites", GoogleSitesSchema);

export default GoogleSites;
