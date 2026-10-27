import mongoose from "mongoose";

const schema = new mongoose.Schema({
  vendorName: { type: String, required: true },
  companyName: String,
  email: String,
  phone: String,
  address: String,
  category: String,
  contactPerson: String,
  performanceScore: { type: Number, default: 0 },
  qualityScore: { type: Number, default: 0 },
  deliveryScore: { type: Number, default: 0 },
  complianceScore: { type: Number, default: 0 },
  responseScore: { type: Number, default: 0 },
  status: { type: String, enum: ["Active", "Inactive", "Suspended"], default: "Active" },
  riskLevel: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  notes: String
}, { timestamps: true });

export default mongoose.model("Vendor", schema);
