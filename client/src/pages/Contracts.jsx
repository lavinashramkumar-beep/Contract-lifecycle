
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { Badge, Empty, Loader } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Contracts() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const loadContracts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/contracts", {
        params: {
          search: search.trim(),
          status,
          department,
          category,
          priority
        }
      });

      setRows(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load contracts. Check your server connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadContracts();
    }, 350);

    return () => clearTimeout(timer);
  }, [search, status, department, category, priority]);

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setDepartment("");
    setCategory("");
    setPriority("");
  };

  const deleteContract = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contract?")) {
      return;
    }

    try {
      await api.delete(`/contracts/${id}`);
      await loadContracts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete contract.");
    }
  };

  const submitContract = async (id) => {
    try {
      await api.post(`/contracts/${id}/submit`);
      await loadContracts();
      alert("Contract submitted for approval.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit contract.");
    }
  };

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Contract Management</h1>
          <p className="muted">
            Search, filter and manage your contract portfolio.
          </p>
        </div>

        {["Admin", "Contract Manager"].includes(user?.role) && (
          <Link className="btn primary" to="/contracts/new">
            + Create Contract
          </Link>
        )}
      </div>

      <div className="panel">
        <h3>Advanced Search</h3>

        <div className="toolbar">
          <input
            type="text"
            placeholder="Search contract title or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {[
              "Draft",
              "Pending Approval",
              "Active",
              "Expiring Soon",
              "Expired",
              "Renewed",
              "Rejected",
              "Archived"
            ].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {[
              "IT",
              "Finance",
              "Human Resources",
              "Legal",
              "Operations",
              "Procurement",
              "Sales",
              "Administration"
            ].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {[
              "Service",
              "Software",
              "Employment",
              "NDA",
              "Purchase",
              "Lease",
              "Partnership",
              "Other"
            ].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            {["Low", "Medium", "High", "Critical"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button className="btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>

        <p className="muted">
          {loading ? "Searching contracts..." : `${rows.length} contract(s) found`}
        </p>
      </div>

      {error && (
        <div className="panel">
          <p role="alert">{error}</p>
          <button className="btn" onClick={loadContracts}>
            Try Again
          </button>
        </div>
      )}

      <div className="panel">
        {loading ? (
          <Loader />
        ) : rows.length === 0 ? (
          <Empty />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Contract</th>
                  <th>Vendor</th>
                  <th>Department</th>
                  <th>End Date</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((contract) => (
                  <tr key={contract._id}>
                    <td>
                      <Link to={`/contracts/${contract._id}`}>
                        <b>{contract.contractNumber}</b>
                      </Link>
                      <br />
                      <small>{contract.title}</small>
                    </td>

                    <td>
                      {contract.vendor?.vendorName ||
                        contract.vendor?.companyName ||
                        "—"}
                    </td>

                    <td>{contract.department || "—"}</td>

                    <td>
                      {contract.endDate
                        ? new Date(contract.endDate).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>{money(contract.contractValue)}</td>

                    <td>
                      <Badge>{contract.status}</Badge>
                    </td>

                    <td>{contract.priority || "—"}</td>

                    <td className="actions">
                      <Link
                        className="btn small"
                        to={`/contracts/${contract._id}`}
                      >
                        View
                      </Link>

                      {["Admin", "Contract Manager"].includes(user?.role) && (
                        <>
                          <Link
                            className="btn small"
                            to={`/contracts/${contract._id}/edit`}
                          >
                            Edit
                          </Link>

                          {["Draft", "Rejected"].includes(contract.status) && (
                            <button
                              className="btn small"
                              onClick={() => submitContract(contract._id)}
                            >
                              Submit
                            </button>
                          )}

                          {user?.role === "Admin" && (
                            <button
                              className="btn small danger"
                              onClick={() => deleteContract(contract._id)}
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
