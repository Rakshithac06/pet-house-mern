import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyServiceRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadRequests();
  }, [navigate]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/service-requests/my"
      );

      setRequests(response.data?.requests || []);
    } catch (error) {
      console.error(
        "Load service requests error:",
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

  const cancelRequest = async (requestId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this service request?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const response = await api.put(
        `/service-requests/${requestId}/cancel`
      );

      if (response.data.success) {
        alert(
          "Service request cancelled successfully."
        );

        loadRequests();
      }
    } catch (error) {
      console.error(
        "Cancel service request error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to cancel service request."
      );
    }
  };

  const getStatusClass = (status) => {
    return status
      ?.toLowerCase()
      .replace(/\s+/g, "-");
  };

  return (
    <div className="inner-page my-service-requests-page">

      <div className="inner-page-title">
        <h1>
          My Service Requests 🐾
        </h1>

        <p>
          Track and manage your pet care service requests
        </p>
      </div>

      {loading && (
        <div className="services-loading">
          Loading your requests... 🐾
        </div>
      )}

      {error && (
        <div className="services-error">
          {error}
        </div>
      )}

      {!loading && !error && requests.length === 0 && (
        <div className="services-empty">

          <div className="service-empty-icon">
            🐶
          </div>

          <h2>
            No Service Requests Yet
          </h2>

          <p>
            You haven't requested any pet care services yet.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/services")}
          >
            Explore Services
          </button>

        </div>
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="my-service-request-list">

          {requests.map((request) => (

            <div
              className="my-service-request-card"
              key={request._id}
            >

              <div className="my-service-request-header">

                <div>
                  <span className="service-request-label">
                    SERVICE
                  </span>

                  <h2>
                    {request.service?.name ||
                      "Service unavailable"}
                  </h2>
                </div>

                <span
                  className={`service-request-status ${getStatusClass(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>

              </div>

              <div className="my-service-request-details">

                <div>
                  <span>DATE</span>
                  <strong>
                    {request.date}
                  </strong>
                </div>

                <div>
                  <span>TIME</span>
                  <strong>
                    {request.time}
                  </strong>
                </div>

                <div>
                  <span>PRICE</span>
                  <strong>
                    ₹
                    {Number(
                      request.service?.price || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

              </div>

              <div className="my-service-request-info">

                <p>
                  <strong>
                    📍 Service Address
                  </strong>
                  <br />
                  {request.address}
                </p>

                <p>
                  <strong>
                    📞 Phone
                  </strong>
                  <br />
                  {request.phone}
                </p>

                {request.message && (
                  <p>
                    <strong>
                      💬 Message
                    </strong>
                    <br />
                    {request.message}
                  </p>
                )}

              </div>

              {request.status !== "Completed" &&
                request.status !== "Cancelled" && (
                  <button
                    className="cancel-service-request-btn"
                    onClick={() =>
                      cancelRequest(request._id)
                    }
                  >
                    Cancel Request
                  </button>
                )}

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default MyServiceRequests;