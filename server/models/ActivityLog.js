import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  entityType: String,
  entityId: String,
  description: String
}, { timestamps: true });

export default mongoose.model("ActivityLog", schema);
