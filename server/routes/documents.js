import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { protect, allow } from "../middleware/auth.js";
import * as d from "../controllers/documentController.js";

const uploadDir = path.resolve("uploads");
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir,{recursive:true});
const storage = multer.diskStorage({
  destination:(req,file,cb)=>cb(null,uploadDir),
  filename:(req,file,cb)=>cb(null,`${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g,"_")}`)
});
const upload = multer({storage,limits:{fileSize:10*1024*1024}});
const router=Router(); router.use(protect);
router.post("/upload",allow("Admin","Contract Manager"),upload.single("file"),d.upload);
router.get("/:id/download",d.download);
router.delete("/:id",allow("Admin","Contract Manager"),d.remove);
export default router;
