import Compliance from "../models/Compliance.js";
import { logActivity } from "../utils/log.js";

export async function list(req,res,next){
  try {
    const items = await Compliance.find().populate("contract","title contractNumber").populate("assignedTo","name").sort({dueDate:1});
    const now = new Date();
    for(const x of items) if(x.dueDate < now && x.status !== "Completed" && x.status !== "Overdue"){x.status="Overdue"; await x.save();}
    res.json(items);
  } catch(e){next(e);}
}
export async function create(req,res,next){
  try {
    const item = await Compliance.create(req.body);
    await logActivity(req.user._id,"Created","Compliance",item._id,`Created compliance requirement ${item.requirementName}`);
    res.status(201).json(item);
  }catch(e){next(e);}
}
export async function update(req,res,next){
  try { res.json(await Compliance.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})); }catch(e){next(e);}
}
export async function remove(req,res,next){
  try { await Compliance.findByIdAndDelete(req.params.id); res.json({message:"Compliance requirement deleted"}); }catch(e){next(e);}
}
