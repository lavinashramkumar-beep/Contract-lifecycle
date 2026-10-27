import cron from "node-cron";
import Contract from "../models/Contract.js";
import Notification from "../models/Notification.js";
import Compliance from "../models/Compliance.js";
import User from "../models/User.js";

export async function runReminderCheck() {
  const now = new Date();
  const users = await User.find({ role: { $in: ["Admin", "Contract Manager", "Approver"] } });
  const contracts = await Contract.find({ endDate: { $exists: true } });
  const day = 86400000;

  for (const contract of contracts) {
    const days = Math.ceil((new Date(contract.endDate) - now) / day);
    const thresholds = [90, 60, 30, 15, 7, 1];
    if (thresholds.includes(days) || days < 0) {
      const title = days < 0 ? "Contract expired" : "Contract expiry reminder";
      const message = days < 0
        ? `${contract.title} has expired.`
        : `${contract.title} expires in ${days} day(s).`;
      for (const user of users) {
        const exists = await Notification.findOne({
          user: user._id, contract: contract._id, title, createdAt: { $gte: new Date(now.getTime() - day) }
        });
        if (!exists) await Notification.create({ user: user._id, contract: contract._id, title, message, type: "Expiry" });
      }
    }
  }

  const compliance = await Compliance.find({ dueDate: { $lt: now }, status: { $ne: "Completed" } });
  if (compliance.length) {
    await Compliance.updateMany(
      { dueDate: { $lt: now }, status: { $ne: "Completed" } },
      { $set: { status: "Overdue" } }
    );
  }
}

export function startReminderJob() {
  cron.schedule("0 8 * * *", () => runReminderCheck().catch(console.error));
}
