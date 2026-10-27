import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Vendor from "./models/Vendor.js";
import Contract from "./models/Contract.js";
import Compliance from "./models/Compliance.js";
import Notification from "./models/Notification.js";

await connectDB();
await Promise.all([User.deleteMany({}),Vendor.deleteMany({}),Contract.deleteMany({}),Compliance.deleteMany({}),Notification.deleteMany({})]);

const pass = await bcrypt.hash("Admin@123",10);
const users = await User.insertMany([
  {name:"System Admin",email:"admin@example.com",password:pass,role:"Admin",department:"Administration"},
  {name:"Contract Manager",email:"manager@example.com",password:await bcrypt.hash("Manager@123",10),role:"Contract Manager",department:"Procurement"},
  {name:"Senior Approver",email:"approver@example.com",password:await bcrypt.hash("Approver@123",10),role:"Approver",department:"Legal"},
  {name:"Viewer User",email:"viewer@example.com",password:await bcrypt.hash("Viewer@123",10),role:"Viewer",department:"Finance"}
]);

const vendors = await Vendor.insertMany([
  {vendorName:"TechNova Solutions",companyName:"TechNova Solutions Pvt Ltd",email:"contact@technova.test",phone:"9876543210",category:"Technology",contactPerson:"Arun Kumar",performanceScore:88,qualityScore:92,deliveryScore:86,complianceScore:90,responseScore:84,riskLevel:"Low"},
  {vendorName:"Prime Facilities",companyName:"Prime Facilities India",email:"hello@prime.test",phone:"9876501234",category:"Facilities",contactPerson:"Meena R",performanceScore:76,qualityScore:78,deliveryScore:75,complianceScore:80,responseScore:71,riskLevel:"Medium"},
  {vendorName:"CloudWorks",companyName:"CloudWorks Services",email:"support@cloudworks.test",phone:"9000011111",category:"Cloud",contactPerson:"Rahul S",performanceScore:94,qualityScore:96,deliveryScore:93,complianceScore:95,responseScore:92,riskLevel:"Low"}
]);

const now = new Date();
const plus = d => new Date(now.getTime()+d*86400000);
const contracts = await Contract.insertMany([
  {contractNumber:"CNT-1001",title:"Cloud Infrastructure Agreement",description:"Cloud hosting and support services.",contractType:"Service Agreement",category:"Technology",department:"IT",vendor:vendors[2]._id,owner:users[1]._id,startDate:plus(-180),endDate:plus(45),renewalDate:plus(15),contractValue:1250000,currency:"INR",paymentTerms:"Quarterly",status:"Active",priority:"High",approvalStatus:"Approved"},
  {contractNumber:"CNT-1002",title:"Office Facility Management",description:"Facility operations and maintenance.",contractType:"Vendor Agreement",category:"Facilities",department:"Administration",vendor:vendors[1]._id,owner:users[1]._id,startDate:plus(-100),endDate:plus(180),renewalDate:plus(150),contractValue:650000,currency:"INR",status:"Active",priority:"Medium",approvalStatus:"Approved"},
  {contractNumber:"CNT-1003",title:"Software Development Partner",description:"External software development services.",contractType:"Service Agreement",category:"Technology",department:"Engineering",vendor:vendors[0]._id,owner:users[1]._id,startDate:plus(-20),endDate:plus(365),renewalDate:plus(335),contractValue:2200000,currency:"INR",status:"Pending Approval",priority:"High",approvalStatus:"Pending"},
  {contractNumber:"CNT-1004",title:"Non Disclosure Agreement",description:"Confidentiality agreement.",contractType:"NDA",category:"Legal",department:"Legal",vendor:vendors[0]._id,owner:users[1]._id,startDate:plus(-30),endDate:plus(330),contractValue:0,currency:"INR",status:"Draft",priority:"Low",approvalStatus:"Pending"},
  {contractNumber:"CNT-1005",title:"Annual Procurement Agreement",description:"Annual procurement services.",contractType:"Purchase Agreement",category:"Procurement",department:"Procurement",vendor:vendors[1]._id,owner:users[1]._id,startDate:plus(-300),endDate:plus(-5),renewalDate:plus(-35),contractValue:900000,currency:"INR",status:"Expired",priority:"Critical",approvalStatus:"Approved"}
]);

await Compliance.insertMany([
  {requirementName:"Annual security review",description:"Review cloud security controls.",contract:contracts[0]._id,assignedTo:users[1]._id,dueDate:plus(20),status:"Pending",priority:"High"},
  {requirementName:"Vendor insurance certificate",description:"Maintain valid certificate.",contract:contracts[1]._id,assignedTo:users[1]._id,dueDate:plus(7),status:"In Progress",priority:"Medium"},
  {requirementName:"Data processing assessment",description:"Complete DPA assessment.",contract:contracts[2]._id,assignedTo:users[2]._id,dueDate:plus(35),status:"Pending",priority:"Critical"}
]);

await Notification.create({user:users[2]._id,contract:contracts[2]._id,title:"Approval required",message:"Software Development Partner is waiting for approval.",type:"Approval"});
console.log("Seed completed.");
await mongoose.connection.close();
