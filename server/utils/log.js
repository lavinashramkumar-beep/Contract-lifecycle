import ActivityLog from "../models/ActivityLog.js";

export async function logActivity(user, action, entityType, entityId, description) {
  await ActivityLog.create({ user, action, entityType, entityId, description });
}
