import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function DogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDog();
  }, [id]);

  const loadDog = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/dogs/${id}`);

      if (response.data.success) {
        setDog(response.data.dog);
      }
    } catch (error) {
      console.error("Get dog details error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load dog details."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dog-details-page">
        <div className="dog-details-loading">
          🐾 Loading furry friend...
        </div>
      </div>
    );
  }

  if (error || !dog) {
    return (
      <div className="dog-details-page">
        <div className="dog-details-error">
          <div>🐶</div>
          <h2>Dog Not Found</h2>
          <p>{error || "This dog is no longer available."}</p>

          <Link to="/dogs" className="back-dogs-btn">
            ← Back to Dogs
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = dog.image
    ? `/images/${dog.image}`
    : "";

  const handleAction = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert(
      dog.type === "Adoption"
        ? "Please login to request adoption."
        : "Please login to continue."
    );

    navigate("/login");
    return;
  }

  try {
    const requestType =
      dog.type === "Adoption" ? "Adoption" : "Purchase";

    const response = await api.post("/dog-requests", {
      dogId: dog._id,
      requestType,
      message: ""
    });

    if (response.data.success) {
      alert(
        dog.type === "Adoption"
          ? "Adoption request submitted successfully! 🏠❤️"
          : "Purchase request submitted successfully! 🐶💜"
      );
    }

  } catch (error) {
    console.error("Dog request error:", error);

    if (error.response?.status === 401) {
      alert("Your session has expired. Please login again.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
      return;
    }

    alert(
      error.response?.data?.message ||
      "Unable to submit request. Please try again."
    );
  }
};

  return (
    <div className="dog-details-page">

      {/* Back Button */}
      <div className="dog-details-container">
        <Link to="/dogs" className="dog-back-link">
          ← Back to Dogs
        </Link>

        <div className="dog-details-card">

          {/* Image Section */}
          <div className="dog-details-image-section">

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={dog.name}
                className="dog-details-image"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }}
              />
            ) : null}

            <div
              className="dog-details-placeholder"
              style={{
                display: imageUrl ? "none" : "flex"
              }}
            >
              🐶
            </div>

            <span
              className={
                dog.type === "Adoption"
                  ? "dog-details-badge adoption-details-badge"
                  : "dog-details-badge sale-details-badge"
              }
            >
              {dog.type === "Adoption"
                ? "🏠 Available for Adoption"
                : "💜 Available for Sale"}
            </span>
          </div>

          {/* Information Section */}
          <div className="dog-details-info">

            <div className="dog-details-title-row">
              <div>
                <p className="dog-details-label">
                  {dog.type === "Adoption"
                    ? "Looking for a forever home"
                    : "Available for a loving family"}
                </p>

                <h1>{dog.name}</h1>

                <p className="dog-details-breed">
                  {dog.breed}
                </p>
              </div>

              <div className="dog-details-gender">
                {dog.gender === "Male" ? "♂️" : "♀️"}
                <span>{dog.gender}</span>
              </div>
            </div>

            {/* Quick Information */}
            <div className="dog-details-stats">

              <div className="dog-stat">
                <span>🎂</span>
                <div>
                  <small>Age</small>
                  <strong>
                    {dog.age} {dog.age === 1 ? "year" : "years"}
                  </strong>
                </div>
              </div>

              <div className="dog-stat">
                <span>📍</span>
                <div>
                  <small>Location</small>
                  <strong>{dog.location}</strong>
                </div>
              </div>

              <div className="dog-stat">
                <span>🐾</span>
                <div>
                  <small>Type</small>
                  <strong>{dog.type}</strong>
                </div>
              </div>

            </div>

            {/* About */}
            <div className="dog-about">
              <h2>About {dog.name} 🐾</h2>

              <p>{dog.description}</p>
            </div>

            {/* Price */}
            <div className="dog-details-price-section">

              {dog.type === "Adoption" ? (
                <div>
                  <small>Adoption Fee</small>
                  <strong className="free-adoption-price">
                    Free Adoption ❤️
                  </strong>
                </div>
              ) : (
                <div>
                  <small>Price</small>
                  <strong>
                    ₹{dog.price.toLocaleString("en-IN")}
                  </strong>
                </div>
              )}

            </div>

            {/* Action */}
            <button
              className="dog-main-action"
              onClick={handleAction}
            >
              {dog.type === "Adoption"
                ? "🏠 Request Adoption"
                : "🐶 Buy This Dog"}
            </button>

            <p className="dog-safety-note">
              ❤️ Every pet deserves a safe, caring and loving home.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DogDetails;