import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyDonations() {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadDonations();
  }, [navigate]);

  const loadDonations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/donations/my");

      setDonations(response.data?.donations || []);
    } catch (error) {
      console.error("Load donations error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load your donations."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return status
      ?.toLowerCase()
      .replace(/\s+/g, "-");
  };

  return (
    <div className="inner-page my-donations-page">

      <div className="inner-page-title">
        <h1>
          My Donations ❤️🐾
        </h1>

        <p>
          Thank you for helping stray dogs in need
        </p>
      </div>

      {loading && (
        <div className="services-loading">
          Loading your donations... ❤️
        </div>
      )}

      {error && (
        <div className="services-error">
          {error}
        </div>
      )}

      {!loading && !error && donations.length === 0 && (
        <div className="services-empty">

          <div className="service-empty-icon">
            ❤️
          </div>

          <h2>
            No Donations Yet
          </h2>

          <p>
            Your donations will appear here.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/donate")}
          >
            Make a Donation
          </button>

        </div>
      )}

      {!loading && !error && donations.length > 0 && (
        <div className="my-donations-list">

          {donations.map((donation) => (

            <div
              className="my-donation-card"
              key={donation._id}
            >

              <div className="my-donation-header">

                <div>
                  <span className="donation-label">
                    DONATION
                  </span>

                  <h2>
                    ₹
                    {Number(
                      donation.amount
                    ).toLocaleString("en-IN")}
                  </h2>
                </div>

                <span
                  className={`donation-status ${getStatusClass(
                    donation.status
                  )}`}
                >
                  {donation.status}
                </span>

              </div>

              <div className="my-donation-details">

                <div>
                  <span>
                    PAYMENT METHOD
                  </span>

                  <strong>
                    {donation.paymentMethod}
                  </strong>
                </div>

                <div>
                  <span>
                    PAYMENT STATUS
                  </span>

                  <strong>
                    {donation.paymentStatus}
                  </strong>
                </div>

                <div>
                  <span>
                    DATE
                  </span>

                  <strong>
                    {new Date(
                      donation.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      }
                    )}
                  </strong>
                </div>

              </div>

              <div className="my-donation-info">

                <p>
                  <strong>
                    👤 Donor
                  </strong>
                  <br />
                  {donation.donorName}
                </p>

                <p>
                  <strong>
                    📞 Phone
                  </strong>
                  <br />
                  {donation.phone}
                </p>

                {donation.message && (
                  <p>
                    <strong>
                      💬 Message
                    </strong>
                    <br />
                    {donation.message}
                  </p>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default MyDonations;