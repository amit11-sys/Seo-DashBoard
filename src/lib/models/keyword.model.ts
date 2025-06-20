import mongoose from "mongoose";

const keywordSchema = new mongoose.Schema(
  {
    keyword: { type: [String] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Keyword =
  mongoose.models.Keyword || mongoose.model("Keyword", keywordSchema);
export default Keyword;
