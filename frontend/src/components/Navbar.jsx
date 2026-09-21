import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);

    alert("You have been logged out successfully.");
    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <Link to="/" className="logo">
        <span className="logo-icon">🐾</span>
        <span>Pet House</span>
      </Link>

      {/* Navigation */}
      <div className="nav-links">

        <Link to="/">
          🏠 Home
        </Link>

        <Link to="/products">
          🛍️ Products
        </Link>

        <Link to="/cart">
          🛒 Cart
        </Link>

        <Link to="/wishlist">
          ❤️ Wishlist
        </Link>

        <Link to="/orders">
          📦 Orders
        </Link>

        <Link to="/my-service-requests">
  🛠️ My Services
</Link>

<Link to="/my-dog-requests">
  🐶 My Pet Requests
</Link>

<Link to="/donate">
  ❤️ Donate
</Link>

        {!isLoggedIn ? (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link
              to="/register"
              className="register-link"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;