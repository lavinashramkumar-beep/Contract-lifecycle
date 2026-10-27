import mongoose from "mongoose";

const schema = new mongoose.Schema({
  requirementName: { type: String, required: true },
  description: String,
  contract: { type: mongoose.Schema.Types.ObjectId, ref: "Contract" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dueDate: Date,
  status: { type: String, enum: ["Pending","In Progress","Completed","Overdue"], default: "Pending" },
  priority: { type: String, enum: ["Low","Medium","High","Critical"], default: "Medium" },
  evidence: String,
  notes: String
}, { timestamps: true });

export default mongoose.model("Compliance", schema);
