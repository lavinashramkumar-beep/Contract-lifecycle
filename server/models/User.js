import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Contract Manager", "Approver", "Viewer"], default: "Viewer" },
  department: { type: String, default: "General" }
}, { timestamps: true });

export default mongoose.model("User", schema);
