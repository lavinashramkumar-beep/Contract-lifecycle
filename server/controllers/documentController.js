import Document from "../models/Document.js";
import path from "path";
import fs from "fs";

export async function upload(req,res,next){
  try {
    if(!req.file) return res.status(400).json({message:"No file uploaded"});
    const doc = await Document.create({
      fileName:req.file.originalname,
      filePath:req.file.path,
      fileType:req.file.mimetype,
      fileSize:req.file.size,
      contract:req.body.contract,
      uploadedBy:req.user._id
    });
    res.status(201).json(doc);
  }catch(e){next(e);}
}
export async function download(req,res,next){
  try {
    const doc = await Document.findById(req.params.id);
    if(!doc || !fs.existsSync(doc.filePath)) return res.status(404).json({message:"File not found"});
    res.download(path.resolve(doc.filePath),doc.fileName);
  }catch(e){next(e);}
}
export async function remove(req,res,next){
  try {
    const doc = await Document.findById(req.params.id);
    if(!doc) return res.status(404).json({message:"Document not found"});
    if(fs.existsSync(doc.filePath)) fs.unlinkSync(doc.filePath);
    await doc.deleteOne();
    res.json({message:"Document deleted"});
  }catch(e){next(e);}
}
