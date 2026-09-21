import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminDogRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/dog-requests");

      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error("Get admin dog requests error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load dog requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId, status) => {
    try {
      setUpdatingId(requestId);

      const response = await api.put(
        `/admin/dog-requests/${requestId}`,
        { status }
      );

      if (response.data.success) {
        setRequests((currentRequests) =>
          currentRequests.map((request) =>
            request._id === requestId
              ? response.data.request
              : request
          )
        );

        alert(
          `Request ${status.toLowerCase()} successfully!`
        );
      }
    } catch (error) {
      console.error("Update dog request error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to update request."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="admin-dog-requests-page">
        <div className="admin-dog-requests-loading">
          🐾 Loading pet requests...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dog-requests-page">
      <div className="admin-dog-requests-container">

        {/* Header */}
        <div className="admin-dog-requests-header">
          <div>
            <span className="admin-badge">
              🐾 Pet House Admin
            </span>

            <h1>Dog Requests</h1>

            <p>
              Review and manage dog purchase and adoption requests.
            </p>
          </div>

          <Link
            to="/admin"
            className="admin-back-dashboard"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="admin-dog-request-error">
            {error}
          </div>
        )}

        {/* Empty */}
        {!error && requests.length === 0 && (
          <div className="admin-no-dog-requests">
            <div>🐾</div>
            <h2>No requests yet</h2>
            <p>
              There are currently no dog purchase or adoption
              requests.
            </p>
          </div>
        )}

        {/* Requests */}
        {requests.length > 0 && (
          <div className="admin-dog-requests-list">
            {requests.map((request) => {
              const dog = request.dog;
              const user = request.user;

              const imageUrl = dog?.image
                ? `/images/${dog.image}`
                : "";

              const isUpdating =
                updatingId === request._id;

              return (
                <div
                  className="admin-dog-request-card"
                  key={request._id}
                >

                  {/* Dog Image */}
                  <div className="admin-dog-request-image">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={dog?.name || "Dog"}
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";

                          e.currentTarget.nextElementSibling.style.display =
                            "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className="admin-dog-request-placeholder"
                      style={{
                        display: imageUrl
                          ? "none"
                          : "flex"
                      }}
                    >
                      🐶
                    </div>
                  </div>

                  {/* Main Information */}
                  <div className="admin-dog-request-info">

                    <div className="admin-dog-request-top">

                      <div>
                        <h2>
                          {dog?.name || "Dog"}
                        </h2>

                        <p className="admin-request-breed">
                          {dog?.breed || "Breed unavailable"}
                        </p>
                      </div>

                      <span
                        className={
                          request.requestType === "Adoption"
                            ? "admin-request-type adoption-request"
                            : "admin-request-type purchase-request"
                        }
                      >
                        {request.requestType === "Adoption"
                          ? "🏠 Adoption"
                          : "💜 Purchase"}
                      </span>

                    </div>

                    {/* Request Details */}
                    <div className="admin-request-details">

                      <div>
                        <small>Customer</small>
                        <strong>
                          👤 {user?.name || "Unknown"}
                        </strong>
                      </div>

                      <div>
                        <small>Email</small>
                        <strong>
                          ✉️ {user?.email || "Unavailable"}
                        </strong>
                      </div>

                      <div>
                        <small>Location</small>
                        <strong>
                          📍 {dog?.location || "Unavailable"}
                        </strong>
                      </div>

                      <div>
                        <small>Requested On</small>
                        <strong>
                          📅 {formatDate(request.createdAt)}
                        </strong>
                      </div>

                    </div>

                    {/* Bottom */}
                    <div className="admin-request-bottom">

                      <div>
                        <small>Status</small>

                        <span
                          className={`admin-request-status ${request.status.toLowerCase()}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <div className="admin-request-actions">

                        {request.status === "Pending" && (
                          <>
                            <button
                              className="approve-request-btn"
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus(
                                  request._id,
                                  "Approved"
                                )
                              }
                            >
                              {isUpdating
                                ? "Updating..."
                                : "✓ Approve"}
                            </button>

                            <button
                              className="reject-request-btn"
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus(
                                  request._id,
                                  "Rejected"
                                )
                              }
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}

                        {request.status === "Approved" && (
                          <button
                            className="complete-request-btn"
                            disabled={isUpdating}
                            onClick={() =>
                              updateStatus(
                                request._id,
                                "Completed"
                              )
                            }
                          >
                            {isUpdating
                              ? "Updating..."
                              : "✓ Mark Completed"}
                          </button>
                        )}

                        <Link
                          to={`/dogs/${dog?._id}`}
                          className="admin-view-dog-btn"
                        >
                          View Dog →
                        </Link>

                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDogRequests;