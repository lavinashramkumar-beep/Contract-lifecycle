import {Router} from "express";
import {protect,allow} from "../middleware/auth.js";
import User from "../models/User.js";
const router=Router();
router.use(protect,allow("Admin"));
router.get("/",async(req,res,next)=>{try{res.json(await User.find().select("-password").sort({createdAt:-1}))}catch(e){next(e)}});
export default router;
