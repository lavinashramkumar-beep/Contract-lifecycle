import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  contract: { type: mongoose.Schema.Types.ObjectId, ref: "Contract" },
  title: String,
  message: String,
  type: { type: String, enum: ["Expiry","Renewal","Approval","Compliance","System"], default: "System" },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Notification", schema);
