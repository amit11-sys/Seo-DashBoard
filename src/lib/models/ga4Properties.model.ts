import mongoose, { Document, Model, ObjectId } from "mongoose";

interface IGoogleProperty extends Document {
  accountId: string;
  propertyId: string;
  displayName: string;
  // currencyCode: string;
  // timeZone: string;
  googleAccountId: ObjectId;
}

const GooglePropertySchema = new mongoose.Schema<IGoogleProperty>(
  {
    accountId: { type: String },
    propertyId: { type: String },
    displayName: { type: String },
    // currencyCode: { type: String },
    // timeZone: { type: String },
    googleAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoogleAccount",
    },
  },
  { timestamps: true }
);

const GoogleProperty: Model<IGoogleProperty> =
  mongoose.models.GoogleProperty ||
  mongoose.model<IGoogleProperty>("GoogleProperty", GooglePropertySchema);

export default GoogleProperty;
