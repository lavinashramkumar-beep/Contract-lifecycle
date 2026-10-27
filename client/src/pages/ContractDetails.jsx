
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import { Badge, Loader } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ContractDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [renew, setRenew] = useState({
    newStartDate: "",
    newEndDate: "",
    notes: ""
  });

  const loadContract = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/contracts/${id}`);
      const result = response.data;

      if (!result || !result.contract) {
        throw new Error("Contract details were not returned by the server.");
      }

      setData({
        contract: result.contract,
        approvals: Array.isArray(result.approvals) ? result.approvals : [],
        renewals: Array.isArray(result.renewals) ? result.renewals : []
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load contract details."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadContract();
  }, [loadContract]);

  const performAction = async (action) => {
    setMessage("");
    setError("");

    try {
      const payload = action === "reject" ? { comment } : {};
      await api.post(`/contracts/${id}/${action}`, payload);
      setComment("");
      setMessage(
        action === "approve"
          ? "Contract approved successfully."
          : "Contract rejected successfully."
      );
      await loadContract();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "The requested action could not be completed."
      );
    }
  };

  const renewContract = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (new Date(renew.newEndDate) <= new Date(renew.newStartDate)) {
      setError("The end date must be after the start date.");
      return;
    }

    try {
      await api.post(`/contracts/${id}/renew`, renew);
      setMessage("Contract renewed successfully.");
      setRenew({ newStartDate: "", newEndDate: "", notes: "" });
      await loadContract();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "The contract could not be renewed."
      );
    }
  };

  if (loading) {
    return <div className="panel"><Loader /></div>;
  }

  if (error && !data) {
    return (
      <div className="panel">
        <h2>Unable to open contract</h2>
        <p className="danger-text">{error}</p>
        <div className="actions">
          <button className="btn primary" onClick={loadContract}>
            Try Again
          </button>
          <button className="btn" onClick={() => navigate("/contracts")}>
            Back to Contracts
          </button>
        </div>
      </div>
    );
  }

  if (!data?.contract) {
    return (
      <div className="panel">
        <h2>Contract not found</h2>
        <Link className="btn" to="/contracts">Back to Contracts</Link>
      </div>
    );
  }

  const contract = data.contract;
  const approvals = data.approvals;
  const renewals = data.renewals;
  const canManage = ["Admin", "Contract Manager"].includes(user?.role);
  const canApprove = ["Admin", "Approver"].includes(user?.role);

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
  };

  const formatDateTime = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleString();
  };

  const daysRemaining = contract.endDate
    ? Math.ceil(
        (new Date(contract.endDate).getTime() - Date.now()) / 86400000
      )
    : null;

  return (
    <div>
      <div className="page-head">
        <div>
          <Link to="/contracts" className="back">
            ← Contracts
          </Link>
          <h1>{contract.title || "Contract Details"}</h1>
          <p className="muted">
            {contract.contractNumber || "No contract number"} ·{" "}
            {contract.contractType || "General"}
          </p>
        </div>

        {canManage && (
          <div className="actions">
            <Link className="btn" to={`/contracts/${id}/edit`}>
              Edit
            </Link>
          </div>
        )}
      </div>

      {error && <div className="panel danger-text">{error}</div>}
      {message && <div className="panel">{message}</div>}

      <div className="detail-grid">
        <div className="panel">
          <div className="detail-title">
            <h3>Contract Overview</h3>
            <Badge>{contract.status || "Unknown"}</Badge>
          </div>

          <div className="info-grid">
            <div>
              <small>Vendor</small>
              <b>{contract.vendor?.vendorName || contract.vendor?.companyName || "—"}</b>
            </div>
            <div>
              <small>Department</small>
              <b>{contract.department || "—"}</b>
            </div>
            <div>
              <small>Start Date</small>
              <b>{formatDate(contract.startDate)}</b>
            </div>
            <div>
              <small>End Date</small>
              <b>{formatDate(contract.endDate)}</b>
            </div>
            <div>
              <small>Contract Value</small>
              <b>₹{Number(contract.contractValue || 0).toLocaleString("en-IN")}</b>
            </div>
            <div>
              <small>Priority</small>
              <b><Badge>{contract.priority || "Normal"}</Badge></b>
            </div>
            <div>
              <small>Approval</small>
              <b><Badge>{contract.approvalStatus || "—"}</Badge></b>
            </div>
            <div>
              <small>Days Remaining</small>
              <b className={daysRemaining !== null && daysRemaining < 30 ? "danger-text" : ""}>
                {daysRemaining === null ? "—" : daysRemaining}
              </b>
            </div>
            <div>
              <small>Contract Owner</small>
              <b>{contract.owner?.name || "—"}</b>
            </div>
            <div>
              <small>Category</small>
              <b>{contract.category || "—"}</b>
            </div>
          </div>

          <hr />
          <h3>Description</h3>
          <p>{contract.description || "No description provided."}</p>

          <h3>Payment Terms</h3>
          <p>{contract.paymentTerms || "Not specified."}</p>
        </div>

        <div>
          <div className="panel lifecycle">
            <h3>Lifecycle</h3>
            {[
              "Draft",
              "Pending Approval",
              "Approved",
              "Active",
              "Renewed",
              "Expired",
              "Archived"
            ].map((status, index) => (
              <div
                className={`step ${contract.status === status ? "current" : ""}`}
                key={status}
              >
                <span>{index + 1}</span>
                {status}
              </div>
            ))}
          </div>

          {contract.status === "Pending Approval" && canApprove && (
            <div className="panel">
              <h3>Approval Action</h3>
              <textarea
                placeholder="Comment or rejection reason"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
              <div className="actions">
                <button
                  className="btn success"
                  onClick={() => performAction("approve")}
                >
                  Approve
                </button>
                <button
                  className="btn danger"
                  onClick={() => {
                    if (!comment.trim()) {
                      setError("Enter a rejection reason.");
                      return;
                    }
                    performAction("reject");
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {canManage && (
            <div className="panel">
              <h3>Renew Contract</h3>
              <form onSubmit={renewContract}>
                <label>New Start Date</label>
                <input
                  type="date"
                  required
                  value={renew.newStartDate}
                  onChange={(event) =>
                    setRenew({ ...renew, newStartDate: event.target.value })
                  }
                />

                <label>New End Date</label>
                <input
                  type="date"
                  required
                  value={renew.newEndDate}
                  onChange={(event) =>
                    setRenew({ ...renew, newEndDate: event.target.value })
                  }
                />

                <textarea
                  placeholder="Renewal notes"
                  value={renew.notes}
                  onChange={(event) =>
                    setRenew({ ...renew, notes: event.target.value })
                  }
                />

                <button className="btn primary full" type="submit">
                  Renew Contract
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <h3>Approval History</h3>
        {approvals.length > 0 ? (
          <div className="timeline">
            {approvals.map((approval) => (
              <div className="timeline-item" key={approval._id}>
                <b>{approval.action || "Update"}</b>
                <span>
                  {approval.approver?.name || "System"} ·{" "}
                  {formatDateTime(approval.createdAt)}
                </span>
                <p>{approval.comment || ""}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No approval history.</p>
        )}
      </div>

      <div className="panel">
        <h3>Renewal History</h3>
        {renewals.length > 0 ? (
          renewals.map((renewal) => (
            <div className="history-row" key={renewal._id}>
              <b>{formatDate(renewal.renewalDate)}</b>
              <span>{renewal.renewedBy?.name || "—"}</span>
              <span>
                {formatDate(renewal.oldEndDate)} →{" "}
                {formatDate(renewal.newEndDate)}
              </span>
            </div>
          ))
        ) : (
          <p className="muted">No renewals recorded.</p>
        )}
      </div>
    </div>
  );
}
