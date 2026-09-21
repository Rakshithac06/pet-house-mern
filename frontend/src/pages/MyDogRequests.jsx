import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function MyDogRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await api.get("/dog-requests");

      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error("Get dog requests error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
        "Unable to load your pet requests."
      );
    } finally {
      setLoading(false);
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
      <div className="my-dog-requests-page">
        <div className="dog-requests-loading">
          🐾 Loading your requests...
        </div>
      </div>
    );
  }

  return (
    <div className="my-dog-requests-page">

      <div className="dog-requests-container">

        {/* Header */}
        <div className="dog-requests-header">
          <div>
            <span className="dog-requests-badge">
              🐾 Your Pet Journey
            </span>

            <h1>My Pet Requests</h1>

            <p>
              Track your dog purchase and adoption requests.
            </p>
          </div>

          <div className="dog-requests-header-icon">
            🐶
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="dog-request-error">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && requests.length === 0 && (
          <div className="no-dog-requests">

            <div className="no-request-icon">
              🐾
            </div>

            <h2>No requests yet</h2>

            <p>
              You haven't submitted any dog purchase or
              adoption requests yet.
            </p>

            <Link to="/dogs" className="browse-dogs-btn">
              🐶 Find a Dog
            </Link>

          </div>
        )}

        {/* Requests */}
        {requests.length > 0 && (
          <div className="dog-requests-list">

            {requests.map((request) => {

              const dog = request.dog;

              const imageUrl = dog?.image
                ? `/images/${dog.image}`
                : "";

              return (
                <div
                  className="dog-request-card"
                  key={request._id}
                >

                  {/* Dog Image */}
                  <div className="dog-request-image">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={dog?.name || "Dog"}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling.style.display =
                            "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className="dog-request-placeholder"
                      style={{
                        display: imageUrl ? "none" : "flex"
                      }}
                    >
                      🐶
                    </div>

                  </div>

                  {/* Information */}
                  <div className="dog-request-info">

                    <div className="dog-request-title-row">

                      <div>
                        <h2>{dog?.name || "Dog"}</h2>

                        <p>
                          {dog?.breed || "Breed unavailable"}
                        </p>
                      </div>

                      <span
                        className={
                          request.requestType === "Adoption"
                            ? "request-type adoption-request"
                            : "request-type purchase-request"
                        }
                      >
                        {request.requestType === "Adoption"
                          ? "🏠 Adoption"
                          : "💜 Purchase"}
                      </span>

                    </div>

                    <div className="dog-request-details">

                      <span>
                        🎂 {dog?.age}{" "}
                        {dog?.age === 1 ? "year" : "years"}
                      </span>

                      <span>
                        📍 {dog?.location}
                      </span>

                      <span>
                        📅 {formatDate(request.createdAt)}
                      </span>

                    </div>

                    {/* Status */}
                    <div className="dog-request-bottom">

                      <div>
                        <small>Request Status</small>

                        <span
                          className={`request-status ${request.status.toLowerCase()}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      {dog?._id && (
                        <Link
                          to={`/dogs/${dog._id}`}
                          className="view-request-dog"
                        >
                          View Dog →
                        </Link>
                      )}

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

export default MyDogRequests;