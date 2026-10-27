import mongoose from "mongoose";

const schema = new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: "Contract", required: true },
  approver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, enum: ["Submitted","Approved","Rejected","Resubmitted"] },
  comment: String
}, { timestamps: true });

export default mongoose.model("Approval", schema);
