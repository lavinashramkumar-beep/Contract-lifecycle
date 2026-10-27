import Vendor from "../models/Vendor.js";
import Contract from "../models/Contract.js";
import { logActivity } from "../utils/log.js";

function score(body) {
  const nums = ["qualityScore","deliveryScore","complianceScore","responseScore"].map(k => Number(body[k] ?? 0));
  return Math.round(nums.reduce((a,b) => a+b, 0) / 4);
}

export async function list(req,res,next) {
  try { res.json(await Vendor.find().sort({createdAt:-1})); } catch(e){next(e);}
}
export async function get(req,res,next) {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if(!vendor) return res.status(404).json({message:"Vendor not found"});
    const contracts = await Contract.find({vendor:vendor._id}).sort({createdAt:-1});
    res.json({vendor,contracts});
  } catch(e){next(e);}
}
export async function create(req,res,next) {
  try {
    const data = {...req.body, performanceScore:score(req.body)};
    const vendor = await Vendor.create(data);
    await logActivity(req.user._id,"Created","Vendor",vendor._id,`Created vendor ${vendor.vendorName}`);
    res.status(201).json(vendor);
  } catch(e){next(e);}
}
export async function update(req,res,next) {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id,{...req.body,performanceScore:score(req.body)},{new:true,runValidators:true});
    if(!vendor) return res.status(404).json({message:"Vendor not found"});
    res.json(vendor);
  } catch(e){next(e);}
}
export async function remove(req,res,next) {
  try { await Vendor.findByIdAndDelete(req.params.id); res.json({message:"Vendor deleted"}); } catch(e){next(e);}
}
