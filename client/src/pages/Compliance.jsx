import { useEffect, useState } from "react";
import api from "../services/api.js";
import { Badge, Empty } from "../components/UI.jsx";

export default function Compliance() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompliance();
  }, []);

  const loadCompliance = async () => {
    try {
      const response = await api.get("/compliance");
      setRows(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load compliance:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-head">
          <div>
            <h1>Compliance</h1>
            <p className="muted">Monitor contract compliance requirements</p>
          </div>
        </div>
        <p>Loading compliance records...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Compliance</h1>
          <p className="muted">
            Monitor contract compliance requirements
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <Empty text="No compliance records found" />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Requirement</th>
                <th>Contract</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.requirement ||
                      item.name ||
                      "Compliance Requirement"}
                  </td>

                  <td>
                    {item.contract?.title ||
                      item.contractName ||
                      "N/A"}
                  </td>

                  <td>
                    <Badge>
                      {item.status || "Pending"}
                    </Badge>
                  </td>

                  <td>
                    {item.dueDate
                      ? new Date(item.dueDate).toLocaleDateString()
                      : "N/A"}
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