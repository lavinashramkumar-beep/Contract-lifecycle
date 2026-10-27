import Contract from "../models/Contract.js";
import Renewal from "../models/Renewal.js";
import Vendor from "../models/Vendor.js";
import Compliance from "../models/Compliance.js";

export async function contracts(req,res,next){
  try {
    const rows = await Contract.find().populate("vendor","vendorName").lean();
    res.json(rows);
  }catch(e){next(e);}
}
export async function renewals(req,res,next){
  try { res.json(await Renewal.find().populate("contract","title contractNumber").populate("renewedBy","name").sort({createdAt:-1})); }catch(e){next(e);}
}
export async function vendors(req,res,next){
  try { res.json(await Vendor.find().lean()); }catch(e){next(e);}
}
export async function compliance(req,res,next){
  try { res.json(await Compliance.find().populate("contract","title").lean()); }catch(e){next(e);}
}
