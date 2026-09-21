import { useEffect, useState } from "react";
import api from "../services/api";

function AdminServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingRequest, setUpdatingRequest] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/service-requests"
      );

      setRequests(response.data?.requests || []);
    } catch (error) {
      console.error(
        "Load admin service requests error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load service requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId, status) => {
    try {
      setUpdatingRequest(requestId);

      const response = await api.put(
        `/admin/service-requests/${requestId}`,
        {
          status
        }
      );

      if (response.data.success) {
        alert(
          "Service request updated successfully! ✅"
        );

        loadRequests();
      }
    } catch (error) {
      console.error(
        "Update service request error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to update service request."
      );
    } finally {
      setUpdatingRequest(null);
    }
  };

  const getStatusClass = (status) => {
    return status
      ?.toLowerCase()
      .replace(/\s+/g, "-");
  };

  return (
    <div className="admin-service-requests-page">

      <div className="admin-service-requests-header">

        <div>
          <p className="admin-service-requests-label">
            SERVICE MANAGEMENT
          </p>

          <h1>
            Service Requests 🐾
          </h1>

          <p>
            View customer requests and manage their
            service status.
          </p>
        </div>

        <button
          className="admin-refresh-service-btn"
          onClick={loadRequests}
        >
          🔄 Refresh
        </button>

      </div>

      {error && (
        <div className="admin-service-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-service-loading">
          Loading service requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="admin-service-empty">

          <div className="admin-service-empty-icon">
            🐶
          </div>

          <h2>
            No Service Requests
          </h2>

          <p>
            Customer service requests will appear here.
          </p>

        </div>
      ) : (
        <div className="admin-service-request-list">

          {requests.map((request) => (

            <div
              className="admin-service-request-card"
              key={request._id}
            >

              <div className="admin-service-request-header">

                <div>
                  <span className="admin-service-request-label">
                    SERVICE
                  </span>

                  <h2>
                    {request.service?.name ||
                      "Service unavailable"}
                  </h2>
                </div>

                <span
                  className={`admin-service-status ${getStatusClass(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>

              </div>

              <div className="admin-service-customer">

                <div>
                  <span>
                    CUSTOMER
                  </span>

                  <strong>
                    {request.user?.name ||
                      "Unknown Customer"}
                  </strong>

                  <p>
                    {request.user?.email ||
                      "No email available"}
                  </p>
                </div>

                <div>
                  <span>
                    PRICE
                  </span>

                  <strong>
                    ₹
                    {Number(
                      request.service?.price || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>
                    DURATION
                  </span>

                  <strong>
                    {request.service?.duration ||
                      "N/A"}
                  </strong>
                </div>

              </div>

              <div className="admin-service-details">

                <div>
                  <span>
                    📅 DATE
                  </span>

                  <strong>
                    {request.date}
                  </strong>
                </div>

                <div>
                  <span>
                    🕐 TIME
                  </span>

                  <strong>
                    {request.time}
                  </strong>
                </div>

                <div>
                  <span>
                    📞 PHONE
                  </span>

                  <strong>
                    {request.phone}
                  </strong>
                </div>

              </div>

              <div className="admin-service-address">

                <h3>
                  📍 Service Address
                </h3>

                <p>
                  {request.address}
                </p>

              </div>

              {request.message && (
                <div className="admin-service-message">

                  <h3>
                    💬 Customer Message
                  </h3>

                  <p>
                    {request.message}
                  </p>

                </div>
              )}

              <div className="admin-service-management">

                <div className="admin-service-control">

                  <label>
                    Request Status
                  </label>

                  <select
                    value={request.status}
                    disabled={
                      updatingRequest === request._id
                    }
                    onChange={(e) =>
                      updateStatus(
                        request._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Confirmed">
                      Confirmed
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>

                </div>

                {updatingRequest === request._id && (
                  <span className="admin-service-updating">
                    Updating...
                  </span>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default AdminServiceRequests;