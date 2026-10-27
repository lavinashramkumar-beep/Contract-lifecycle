import { useEffect, useState } from "react";
import api from "../services/api.js";
import { Empty } from "../components/UI.jsx";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      loadNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      loadNotifications();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      loadNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-head">
          <div>
            <h1>Notifications</h1>
            <p className="muted">
              Expiry, approval and compliance alerts
            </p>
          </div>
        </div>

        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Notifications</h1>
          <p className="muted">
            Expiry, approval and compliance alerts
          </p>
        </div>

        {notifications.length > 0 && (
          <button className="btn" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </div>

      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              className={
                notification.read
                  ? "notification"
                  : "notification unread"
              }
              key={notification._id}
            >
              <div className="notice-icon">!</div>

              <div className="notice-content">
                <b>
                  {notification.title || "Notification"}
                </b>

                <p>
                  {notification.message ||
                    "No notification message"}
                </p>

                <small>
                  {notification.createdAt
                    ? new Date(
                        notification.createdAt
                      ).toLocaleString()
                    : ""}
                </small>
              </div>

              <div className="actions">
                {!notification.read && (
                  <button
                    className="btn small"
                    onClick={() =>
                      markRead(notification._id)
                    }
                  >
                    Read
                  </button>
                )}

                <button
                  className="btn small danger"
                  onClick={() =>
                    deleteNotification(notification._id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <Empty text="No notifications found" />
        )}
      </div>
    </div>
  );
}