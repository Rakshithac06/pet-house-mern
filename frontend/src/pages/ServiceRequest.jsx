import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function ServiceRequest() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedServiceId = location.state?.serviceId || "";

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    serviceId: selectedServiceId,
    date: "",
    time: "",
    address: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadServices();
  }, [navigate]);

  const loadServices = async () => {
    try {
      const response = await api.get("/services");

      setServices(response.data?.services || []);
    } catch (error) {
      console.error("Load services error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load services."
      );
    } finally {
      setLoadingServices(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const response = await api.post(
        "/service-requests",
        formData
      );

      if (response.data.success) {
        alert(
          "Service request submitted successfully! 🐾"
        );

        navigate("/my-service-requests");
      }
    } catch (error) {
      console.error(
        "Service request error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to submit service request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inner-page service-request-page">

      <div className="inner-page-title">
        <h1>
          Request a Service 🐾
        </h1>

        <p>
          Tell us how we can take care of your furry friend
        </p>
      </div>

      <div className="service-request-container">

        <form
          className="service-request-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="service-request-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>
              Select Service *
            </label>

            {loadingServices ? (
              <p>Loading services...</p>
            ) : (
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                required
              >
                <option value="">
                  -- Select a Service --
                </option>

                {services.map((service) => (
                  <option
                    key={service._id}
                    value={service._id}
                  >
                    {service.name} — ₹
                    {Number(service.price).toLocaleString(
                      "en-IN"
                    )}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>
                Preferred Date *
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                required
              />
            </div>

            <div className="form-group">
              <label>
                Preferred Time *
              </label>

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label>
              Phone Number *
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Service Address *
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter the address where the service is required"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Additional Message
            </label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any special instructions or information about your pet?"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="primary-button service-submit-button"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Service Request 🐾"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ServiceRequest;