import { Router } from "express";
import { protect, allow } from "../middleware/auth.js";
import * as c from "../controllers/complianceController.js";
const router=Router(); router.use(protect);
router.get("/",c.list);
router.post("/",allow("Admin","Contract Manager"),c.create);
router.put("/:id",allow("Admin","Contract Manager"),c.update);
router.delete("/:id",allow("Admin","Contract Manager"),c.remove);
export default router;
