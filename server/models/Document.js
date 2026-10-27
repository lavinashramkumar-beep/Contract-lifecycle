import mongoose from "mongoose";

const schema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  fileType: String,
  fileSize: Number,
  contract: { type: mongoose.Schema.Types.ObjectId, ref: "Contract" },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Document", schema);
