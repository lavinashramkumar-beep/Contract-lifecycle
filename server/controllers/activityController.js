import ActivityLog from "../models/ActivityLog.js";
export async function list(req,res,next){
  try { res.json(await ActivityLog.find().populate("user","name role").sort({createdAt:-1}).limit(200)); }catch(e){next(e);}
}
