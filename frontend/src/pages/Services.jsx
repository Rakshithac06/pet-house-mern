import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/services");

      setServices(response.data?.services || []);
    } catch (error) {
      console.error("Load services error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (name) => {
    const icons = {
      "Pet Grooming": "✂️",
      "Dog Walking": "🦮",
      "Pet Sitting": "🐶",
      "Pet Training": "🎓"
    };

    return icons[name] || "🐾";
  };

  return (
    <div className="inner-page">

      <div className="inner-page-title">

        <h1>
          Our Services ❤️
        </h1>

        <p>
          Caring services for your furry friends
        </p>

      </div>

      {loading && (
        <div className="services-loading">
          Loading services... 🐾
        </div>
      )}

      {error && (
        <div className="services-error">
          {error}
        </div>
      )}

      {!loading && !error && services.length === 0 && (
        <div className="services-empty">
          <h2>No Services Available</h2>
          <p>
            Please check back later for our pet care services.
          </p>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="service-grid">

          {services.map((service) => (

            <div
              className="service-card"
              key={service._id}
            >

              <div className="service-icon">
                {getServiceIcon(service.name)}
              </div>

              <h2>
                {service.name}
              </h2>

              <p>
                {service.description}
              </p>

              <div className="service-details">

                <strong>
                  ₹{Number(service.price).toLocaleString("en-IN")}
                </strong>

                <span>
                  {service.duration}
                </span>

              </div>

              <Link
  to="/service-request"
  state={{ serviceId: service._id }}
  className="primary-button"
>
  Request Service
</Link>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default Services;