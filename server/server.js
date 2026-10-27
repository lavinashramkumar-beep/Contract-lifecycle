
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import contractRoutes from "./routes/contracts.js";
import vendorRoutes from "./routes/vendors.js";
import complianceRoutes from "./routes/compliance.js";
import notificationRoutes from "./routes/notifications.js";
import reportRoutes from "./routes/reports.js";
import documentRoutes from "./routes/documents.js";
import activityRoutes from "./routes/activities.js";
import userRoutes from "./routes/users.js";

import { notFound, errorHandler } from "./middleware/error.js";
import {
  startReminderJob,
  runReminderCheck
} from "./utils/notifications.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
  res.json({
    message: "Contract Lifecycle Management API"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);

  try {
    await runReminderCheck();
  } catch (e) {
    console.error("Reminder check:", e.message);
  }

  startReminderJob();
});
