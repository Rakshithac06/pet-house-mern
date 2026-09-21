import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Donate() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState(100);
  const [donorName, setDonorName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleDonate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to make a donation.");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await api.post("/donations", {
        amount: Number(amount),
        donorName,
        phone,
        message
      });

      if (response.data.success) {
        alert(
          "Thank you for your donation! ❤️🐾"
        );

        navigate("/my-donations");
      }
    } catch (error) {
      console.error("Donation error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Your session has expired. Please login again.");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
        "Unable to submit donation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">

      <div className="form-card">

        <h1>
          Help Stray Dogs 🐕❤️
        </h1>

        <p>
          Your contribution can help provide
          food, treatment and shelter.
        </p>

        <form onSubmit={handleDonate}>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-group">

            <label>
              Donor Name
            </label>

            <input
              type="text"
              value={donorName}
              onChange={(e) =>
                setDonorName(e.target.value)
              }
              placeholder="Enter your name"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Enter your phone number"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Donation Amount (₹)
            </label>

            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label>
              Message
            </label>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Write a message (optional)"
              rows="4"
            />

          </div>

          <button
            className="form-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : `Donate ₹${amount}`}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Donate;