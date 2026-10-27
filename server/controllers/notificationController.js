import Notification from "../models/Notification.js";

export async function list(req,res,next){
  try { res.json(await Notification.find({user:req.user._id}).populate("contract","title contractNumber").sort({createdAt:-1})); } catch(e){next(e);}
}
export async function read(req,res,next){
  try { res.json(await Notification.findOneAndUpdate({_id:req.params.id,user:req.user._id},{read:true},{new:true})); }catch(e){next(e);}
}
export async function readAll(req,res,next){
  try { await Notification.updateMany({user:req.user._id},{read:true}); res.json({message:"All notifications marked as read"}); }catch(e){next(e);}
}
export async function remove(req,res,next){
  try { await Notification.findOneAndDelete({_id:req.params.id,user:req.user._id}); res.json({message:"Notification deleted"}); }catch(e){next(e);}
}
