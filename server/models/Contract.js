import mongoose from "mongoose";

const schema = new mongoose.Schema({
  contractNumber: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  contractType: { type: String, default: "Vendor Agreement" },
  category: { type: String, default: "Other" },
  department: { type: String, default: "General" },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: Date,
  endDate: Date,
  renewalDate: Date,
  contractValue: { type: Number, default: 0 },
  currency: { type: String, default: "INR" },
  paymentTerms: String,
  status: { type: String, enum: ["Draft","Pending Approval","Approved","Active","Expiring Soon","Expired","Renewed","Terminated","Archived","Rejected"], default: "Draft" },
  priority: { type: String, enum: ["Low","Medium","High","Critical"], default: "Medium" },
  complianceStatus: { type: String, enum: ["Compliant","At Risk","Non-Compliant"], default: "Compliant" },
  approvalStatus: { type: String, enum: ["Pending","Approved","Rejected"], default: "Pending" },
  notes: String
}, { timestamps: true });

export default mongoose.model("Contract", schema);
