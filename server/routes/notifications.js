import { Router } from "express";
import { protect } from "../middleware/auth.js";
import * as n from "../controllers/notificationController.js";
const router=Router(); router.use(protect);
router.get("/",n.list); router.put("/:id/read",n.read); router.put("/read-all",n.readAll); router.delete("/:id",n.remove);
export default router;
