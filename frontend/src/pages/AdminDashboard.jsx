import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
    const [stats, setStats] = useState({
  totalDogs: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalDogRequests: 0
});

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  loadStats();
}, []);

const loadStats = async () => {
  try {
    const response = await api.get("/admin/dashboard/stats");

    if (response.data.success) {
      setStats(response.data.stats);
    }
  } catch (error) {
    console.error("Dashboard stats error:", error);

    setError(
      error.response?.data?.message ||
      "Unable to load dashboard statistics."
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="admin-dashboard">
      <div className="admin-container">

        {/* Header */}
        <div className="admin-header">
          <div>
            <span className="admin-badge">🐾 Pet House Admin</span>
            <h1>Admin Dashboard</h1>
            <p>
              Manage your pet store, customers, orders and furry friends.
            </p>
          </div>

          <div className="admin-header-icon">
            🐶
          </div>
        </div>

        {/* Statistics */}
        <div className="admin-stats">

          <div className="admin-stat-card">
  <div className="admin-stat-icon purple">🐶</div>
  <div>
    <span>Total Dogs</span>
    <strong>{loading ? "..." : stats.totalDogs}</strong>
  </div>
</div>

<div className="admin-stat-card">
  <div className="admin-stat-icon pink">📦</div>
  <div>
    <span>Total Orders</span>
    <strong>{loading ? "..." : stats.totalOrders}</strong>
  </div>
</div>

<div className="admin-stat-card">
  <div className="admin-stat-icon blue">👥</div>
  <div>
    <span>Customers</span>
    <strong>{loading ? "..." : stats.totalCustomers}</strong>
  </div>
</div>

<div className="admin-stat-card">
  <div className="admin-stat-icon green">🏠</div>
  <div>
    <span>Pet Requests</span>
    <strong>{loading ? "..." : stats.totalDogRequests}</strong>
  </div>
</div>

        </div>

        {/* Management Section */}
        <section className="admin-management">
          <div className="admin-section-title">
            <div>
              <h2>Management</h2>
              <p>Quick access to your Pet House modules.</p>
            </div>
          </div>

          <div className="admin-management-grid">

            <Link to="/admin/dogs" className="admin-management-card">
              <div className="management-icon">🐶</div>
              <div>
                <h3>Manage Dogs</h3>
                <p>View and manage dogs available for sale and adoption.</p>
              </div>
              <span>→</span>
            </Link>

            <Link to="/admin/orders" className="admin-management-card">
              <div className="management-icon">📦</div>
              <div>
                <h3>Manage Orders</h3>
                <p>View customer orders and track order status.</p>
              </div>
              <span>→</span>
            </Link>

            <Link to="/admin/products" className="admin-management-card">
              <div className="management-icon">🛍️</div>
              <div>
                <h3>Manage Products</h3>
                <p>Manage pet food, toys and accessories.</p>
              </div>
              <span>→</span>
            </Link>

            <Link to="/admin/dog-requests" className="admin-management-card">
              <div className="management-icon">🏠</div>
              <div>
                <h3>Dog Requests</h3>
                <p>Review purchase and adoption requests.</p>
              </div>
              <span>→</span>
            </Link>

            <Link to="/admin/categories" className="admin-management-card">
    <div className="admin-management-icon">
        🏷️
    </div>

    <div>
        <h3>Manage Categories</h3>
        <p>Add, edit and delete product categories</p>
    </div>

    <span className="admin-management-arrow">
        →
    </span>
</Link>

<Link
  to="/admin/service-requests"
  className="admin-management-card"
>
  <div className="admin-management-icon">
    🐾
  </div>

  <div className="admin-management-content">
    <h3>Service Requests</h3>

    <p>
      View and manage customer pet care service requests.
    </p>
  </div>

  <span className="admin-management-arrow">
    →
  </span>
</Link>

<Link
  to="/admin/breeds"
  className="admin-management-card"
>
  <div className="admin-management-icon">
    🐶
  </div>

  <div className="admin-management-content">
    <h3>Manage Breeds</h3>

    <p>
      Add, edit and delete dog breed information.
    </p>
  </div>

  <span className="admin-management-arrow">
    →
  </span>
</Link>

          </div>
        </section>

        {/* Welcome Card */}
        <section className="admin-welcome-card">
          <div className="admin-welcome-content">
            <span>❤️ Welcome to Pet House</span>
            <h2>Helping pets find happy homes.</h2>
            <p>
              Use the admin panel to manage your pet marketplace
              and keep everything running smoothly.
            </p>
          </div>

          <div className="admin-welcome-emoji">
            🐕‍🦺
          </div>
        </section>

      </div>
    </div>
  );
}

export default AdminDashboard;