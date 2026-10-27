import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { list } from "../controllers/activityController.js";
const router=Router(); router.use(protect); router.get("/",list); export default router;
