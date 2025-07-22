import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    locationName: { type: String },
    locationCode: { type: Number }, 
   
  },
  {
    timestamps: true,
  },
);

const Location =
  mongoose.models.Location ||
  mongoose.model("Location", locationSchema);

export default Location;
