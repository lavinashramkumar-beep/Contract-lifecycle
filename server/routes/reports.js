import { Router } from "express";
import { protect } from "../middleware/auth.js";
import * as r from "../controllers/reportController.js";
const router=Router(); router.use(protect);
router.get("/contracts",r.contracts); router.get("/renewals",r.renewals); router.get("/vendors",r.vendors); router.get("/compliance",r.compliance);
export default router;
