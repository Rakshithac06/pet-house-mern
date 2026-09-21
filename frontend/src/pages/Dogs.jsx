import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dogs() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDogs();
  }, []);

  const loadDogs = async () => {
    try {
      const response = await api.get("/dogs");

      if (response.data.success) {
        setDogs(response.data.dogs);
      }
    } catch (error) {
      console.error("Get dogs error:", error);
      setError(
        error.response?.data?.message ||
        "Unable to load dogs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dogs-page">
        <div className="dogs-loading">
          🐾 Finding your furry friends...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dogs-page">
        <div className="dogs-error">
          <h2>Oops! 🐶</h2>
          <p>{error}</p>
          <button onClick={loadDogs}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dogs-page">

      {/* Hero Section */}
      <section className="dogs-hero">
        <div className="dogs-hero-content">
          <span className="dogs-hero-badge">
            🐾 Find Your New Best Friend
          </span>

          <h1>
            Dogs Looking for
            <span> Loving Homes</span>
          </h1>

          <p>
            Meet adorable dogs available for sale and adoption.
            Your perfect furry companion might be waiting for you!
          </p>
        </div>

        <div className="dogs-hero-emoji">
          🐕
        </div>
      </section>

      {/* Page Heading */}
      <section className="dogs-list-section">
        <div className="dogs-section-heading">
          <div>
            <h2>Meet Our Dogs 🐶</h2>
            <p>
              {dogs.length} furry friends currently looking for homes
            </p>
          </div>
        </div>

        {/* Dogs Grid */}
        {dogs.length === 0 ? (
          <div className="no-dogs">
            <div>🐾</div>
            <h2>No dogs available right now</h2>
            <p>Please check back soon for new furry friends.</p>
          </div>
        ) : (
          <div className="dogs-grid">
            {dogs.map((dog) => {
              const imageUrl = dog.image
                ? `/images/${dog.image}`
                : "";

              return (
                <div className="dog-card" key={dog._id}>

                  {/* Image */}
                  <div className="dog-card-image">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={dog.name}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling.style.display =
                            "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className="dog-image-placeholder"
                      style={{
                        display: imageUrl ? "none" : "flex"
                      }}
                    >
                      🐶
                    </div>

                    {/* Sale / Adoption Badge */}
                    <span
                      className={
                        dog.type === "Adoption"
                          ? "dog-badge adoption-badge"
                          : "dog-badge sale-badge"
                      }
                    >
                      {dog.type === "Adoption"
                        ? "🏠 Adoption"
                        : "💜 For Sale"}
                    </span>
                  </div>

                  {/* Information */}
                  <div className="dog-card-content">

                    <div className="dog-name-row">
                      <h3>{dog.name}</h3>
                      <span>
                        {dog.gender === "Male" ? "♂️" : "♀️"}
                      </span>
                    </div>

                    <p className="dog-breed">
                      {dog.breed}
                    </p>

                    <div className="dog-details">
                      <span>🎂 {dog.age} {dog.age === 1 ? "year" : "years"}</span>
                      <span>📍 {dog.location}</span>
                    </div>

                    <p className="dog-description">
                      {dog.description}
                    </p>

                    <div className="dog-card-footer">

                      <div className="dog-price">
                        {dog.type === "Adoption" ? (
                          <strong>Free Adoption</strong>
                        ) : (
                          <>
                            <small>Price</small>
                            <strong>₹{dog.price.toLocaleString("en-IN")}</strong>
                          </>
                        )}
                      </div>

                      <Link
                        to={`/dogs/${dog._id}`}
                        className="view-dog-btn"
                      >
                        View Details →
                      </Link>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dogs;