import { Router } from "express";
import { protect, allow } from "../middleware/auth.js";
import * as v from "../controllers/vendorController.js";
const router=Router(); router.use(protect);
router.get("/",v.list); router.get("/:id",v.get);
router.post("/",allow("Admin","Contract Manager"),v.create);
router.put("/:id",allow("Admin","Contract Manager"),v.update);
router.delete("/:id",allow("Admin"),v.remove);
export default router;
