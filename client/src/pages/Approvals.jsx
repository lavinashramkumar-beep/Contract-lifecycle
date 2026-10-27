import { useEffect, useState } from "react";
import api from "../services/api.js";
import { Badge, Empty } from "../components/UI.jsx";

export default function Approvals() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    try {
      const response = await api.get("/approvals");
      setRows(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load approvals:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const updateApproval = async (id, status) => {
    try {
      await api.put(`/approvals/${id}`, { status });
      loadApprovals();
    } catch (error) {
      console.error("Failed to update approval:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-head">
          <div>
            <h1>Approvals</h1>
            <p className="muted">
              Review and manage contract approval requests
            </p>
          </div>
        </div>

        <p>Loading approvals...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Approvals</h1>
          <p className="muted">
            Review and manage contract approval requests
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <Empty text="No approval requests found" />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Contract</th>
                <th>Requested By</th>
                <th>Status</th>
                <th>Requested Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.contract?.title ||
                      item.contractName ||
                      "N/A"}
                  </td>

                  <td>
                    {item.requestedBy?.name ||
                      item.requestedBy?.email ||
                      "N/A"}
                  </td>

                  <td>
                    <Badge>
                      {item.status || "Pending"}
                    </Badge>
                  </td>

                  <td>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    {item.status === "Pending" && (
                      <div className="actions">
                        <button
                          className="btn small"
                          onClick={() =>
                            updateApproval(item._id, "Approved")
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="btn small danger"
                          onClick={() =>
                            updateApproval(item._id, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}