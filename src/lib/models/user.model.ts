 
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    resetToken: { type: String },
    resetTokenExpires:{ type: String },
    role:{ type: Number, default: 3 },
    
    parentAdminId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isVerified: { type: Boolean, default: true },
    inviteTokenId: { type: String },
    invitedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
 