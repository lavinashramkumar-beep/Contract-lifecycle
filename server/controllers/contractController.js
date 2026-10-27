import Contract from "../models/Contract.js";
import Approval from "../models/Approval.js";
import Renewal from "../models/Renewal.js";
import Notification from "../models/Notification.js";
import Vendor from "../models/Vendor.js";
import { logActivity } from "../utils/log.js";

export async function listContracts(req, res, next) {
  try {
    const { search, status, category, department, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (department) filter.department = department;
    if (priority) filter.priority = priority;
    if (search) filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { contractNumber: { $regex: search, $options: "i" } }
    ];
    const contracts = await Contract.find(filter).populate("vendor", "vendorName companyName").populate("owner", "name email").sort({ createdAt: -1 });
    res.json(contracts);
  } catch (e) { next(e); }
}

export async function getContract(req, res, next) {
  try {
    const contract = await Contract.findById(req.params.id).populate("vendor").populate("owner", "name email");
    if (!contract) return res.status(404).json({ message: "Contract not found" });
    const approvals = await Approval.find({ contract: contract._id }).populate("approver", "name email").sort({ createdAt: -1 });
    const renewals = await Renewal.find({ contract: contract._id }).populate("renewedBy", "name").sort({ createdAt: -1 });
    res.json({ contract, approvals, renewals });
  } catch (e) { next(e); }
}

export async function createContract(req, res, next) {
  try {
    const contract = await Contract.create({ ...req.body, owner: req.user._id });
    await logActivity(req.user._id, "Created", "Contract", contract._id, `Created contract ${contract.contractNumber}`);
    res.status(201).json(contract);
  } catch (e) { next(e); }
}

export async function updateContract(req, res, next) {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!contract) return res.status(404).json({ message: "Contract not found" });
    await logActivity(req.user._id, "Updated", "Contract", contract._id, `Updated contract ${contract.contractNumber}`);
    res.json(contract);
  } catch (e) { next(e); }
}

export async function deleteContract(req, res, next) {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) return res.status(404).json({ message: "Contract not found" });
    await logActivity(req.user._id, "Deleted", "Contract", req.params.id, `Deleted contract ${contract.contractNumber}`);
    res.json({ message: "Contract deleted" });
  } catch (e) { next(e); }
}

export async function submitContract(req, res, next) {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, {
      status: "Pending Approval", approvalStatus: "Pending"
    }, { new: true });
    if (!contract) return res.status(404).json({ message: "Contract not found" });
    await Approval.create({ contract: contract._id, approver: req.user._id, action: "Submitted", comment: req.body.comment });
    const approvers = await import("../models/User.js").then(m => m.default.find({ role: { $in: ["Admin","Approver"] } }));
    for (const user of approvers) await Notification.create({
      user: user._id, contract: contract._id, title: "Approval required",
      message: `${contract.title} has been submitted for approval.`, type: "Approval"
    });
    await logActivity(req.user._id, "Submitted", "Contract", contract._id, `Submitted ${contract.contractNumber} for approval`);
    res.json(contract);
  } catch (e) { next(e); }
}

export async function approveContract(req, res, next) {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, {
      status: "Active", approvalStatus: "Approved"
    }, { new: true });
    if (!contract) return res.status(404).json({ message: "Contract not found" });
    await Approval.create({ contract: contract._id, approver: req.user._id, action: "Approved", comment: req.body.comment });
    await Notification.create({ user: contract.owner, contract: contract._id, title: "Contract approved", message: `${contract.title} was approved.`, type: "Approval" });
    await logActivity(req.user._id, "Approved", "Contract", contract._id, `Approved ${contract.contractNumber}`);
    res.json(contract);
  } catch (e) { next(e); }
}

export async function rejectContract(req, res, next) {
  try {
    if (!req.body.comment) return res.status(400).json({ message: "Rejection reason is required" });
    const contract = await Contract.findByIdAndUpdate(req.params.id, {
      status: "Rejected", approvalStatus: "Rejected"
    }, { new: true });
    if (!contract) return res.status(404).json({ message: "Contract not found" });
    await Approval.create({ contract: contract._id, approver: req.user._id, action: "Rejected", comment: req.body.comment });
    await Notification.create({ user: contract.owner, contract: contract._id, title: "Contract rejected", message: req.body.comment, type: "Approval" });
    await logActivity(req.user._id, "Rejected", "Contract", contract._id, `Rejected ${contract.contractNumber}`);
    res.json(contract);
  } catch (e) { next(e); }
}

export async function renewContract(req, res, next) {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ message: "Contract not found" });
    const { newStartDate, newEndDate, notes } = req.body;
    const renewal = await Renewal.create({
      contract: contract._id,
      oldStartDate: contract.startDate,
      oldEndDate: contract.endDate,
      newStartDate,
      newEndDate,
      renewalDate: new Date(),
      renewedBy: req.user._id,
      notes
    });
    contract.startDate = newStartDate;
    contract.endDate = newEndDate;
    contract.renewalDate = new Date(new Date(newEndDate).getTime() - 30 * 86400000);
    contract.status = "Renewed";
    await contract.save();
    await logActivity(req.user._id, "Renewed", "Contract", contract._id, `Renewed ${contract.contractNumber}`);
    res.json({ contract, renewal });
  } catch (e) { next(e); }
}

export async function dashboard(req, res, next) {
  try {
    const total = await Contract.countDocuments();
    const active = await Contract.countDocuments({ status: { $in: ["Active","Renewed","Expiring Soon"] } });
    const pending = await Contract.countDocuments({ status: "Pending Approval" });
    const expired = await Contract.countDocuments({ status: "Expired" });
    const vendors = await Vendor.countDocuments();
    const now = new Date();
    const soon = new Date(now.getTime() + 90 * 86400000);
    const expiring = await Contract.countDocuments({ endDate: { $gte: now, $lte: soon }, status: { $nin: ["Expired","Archived"] } });
    const values = await Contract.aggregate([{ $group: { _id: null, total: { $sum: "$contractValue" } } }]);
    const byStatus = await Contract.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const byCategory = await Contract.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
    const byDepartment = await Contract.aggregate([{ $group: { _id: "$department", count: { $sum: 1 } } }]);
    res.json({
      cards: { total, active, pending, expired, vendors, expiring, totalValue: values[0]?.total || 0 },
      byStatus, byCategory, byDepartment
    });
  } catch (e) { next(e); }
}
