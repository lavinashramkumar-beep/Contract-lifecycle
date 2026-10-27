import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { Badge, Empty } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Vendors() {
  const [rows, setRows] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const response = await api.get("/vendors");
      setRows(response.data);
    } catch (error) {
      console.error("Failed to load vendors:", error);
      setRows([]);
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm("Delete vendor?")) {
      return;
    }

    try {
      await api.delete(`/vendors/${id}`);
      loadVendors();
    } catch (error) {
      console.error("Failed to delete vendor:", error);
    }
  };

  const canManage =
    user &&
    (user.role === "Admin" || user.role === "Contract Manager");

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Vendors</h1>
          <p className="muted">
            Track vendor relationships and performance
          </p>
        </div>

        {canManage && (
          <Link className="btn primary" to="/vendors/new">
            + Add Vendor
          </Link>
        )}
      </div>

      <div className="vendor-grid">
        {rows.length > 0 ? (
          rows.map((vendor) => (
            <div className="vendor-card" key={vendor._id}>
              <div className="vendor-top">
                <div className="vendor-logo">
                  {vendor.vendorName
                    ? vendor.vendorName.charAt(0).toUpperCase()
                    : "V"}
                </div>

                <div>
                  <h3>{vendor.vendorName || "Unnamed Vendor"}</h3>
                  <p className="muted">
                    {vendor.category || "General"}
                  </p>
                </div>

                <Badge>
                  {vendor.riskLevel || "Low"}
                </Badge>
              </div>

              <div className="score">
                <div>
                  <b>{vendor.performanceScore || 0}</b>
                  <span>/100</span>
                </div>

                <div className="progress">
                  <i
                    style={{
                      width: `${vendor.performanceScore || 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="vendor-meta">
                <span>
                  {vendor.email || "No email"}
                </span>

                <span>
                  {vendor.status || "Active"}
                </span>
              </div>

              <div className="actions">
                <Link
                  className="btn small"
                  to={`/vendors/${vendor._id}`}
                >
                  View
                </Link>

                {canManage && (
                  <Link
                    className="btn small"
                    to={`/vendors/${vendor._id}/edit`}
                  >
                    Edit
                  </Link>
                )}

                {user?.role === "Admin" && (
                  <button
                    className="btn small danger"
                    onClick={() => deleteVendor(vendor._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <Empty text="No vendors found" />
        )}
      </div>
    </div>
  );
}