import mongoose from "mongoose";

const schema = new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: "Contract", required: true },
  oldStartDate: Date,
  oldEndDate: Date,
  newStartDate: Date,
  newEndDate: Date,
  renewalDate: Date,
  renewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notes: String
}, { timestamps: true });

export default mongoose.model("Renewal", schema);
