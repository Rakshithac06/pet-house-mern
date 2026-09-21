import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function ProductCard({ product }) {

  const navigate = useNavigate();

  const addToCart = async (e) => {

    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    // User must login
    if (!token) {
      alert("Please login to add products to your cart.");
      navigate("/login");
      return;
    }

    try {

      const response = await api.post("/cart", {
        productId: product._id,
        quantity: 1
      });

      console.log("ADD TO CART RESPONSE:", response.data);

      alert("Product added to cart successfully! 🛒");

    } catch (error) {

      console.error("Add to cart error:", error);

      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
        "Unable to add product to cart."
      );
    }
  };


  const addToWishlist = async (e) => {

    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    // User must login
    if (!token) {
      alert("Please login to add products to your wishlist.");
      navigate("/login");
      return;
    }

    try {

      const response = await api.post("/wishlist", {
        productId: product._id
      });

      console.log(
        "ADD TO WISHLIST RESPONSE:",
        response.data
      );

      alert("Product added to wishlist! ❤️");

    } catch (error) {

      console.error(
        "Add to wishlist error:",
        error
      );

      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
        "Unable to add product to wishlist."
      );
    }
  };


  const imageUrl = product.image
    ? `/images/${product.image}`
    : "";


  return (

    <div className="product-card">

      <Link
        to={`/products/${product._id}`}
        className="product-link"
      >

        <div className="product-image">

          {imageUrl ? (

            <img
              src={imageUrl}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

          ) : (

            <div className="product-placeholder">
              🐶
            </div>

          )}

        </div>

      </Link>


      <div className="product-info">

        <h3>
          {product.name}
        </h3>

        <p>
          {product.description}
        </p>

        <div className="product-price">
          ₹{product.price}
        </div>


        <div className="product-actions">

          <button
            className="add-cart-btn"
            onClick={addToCart}
          >
            🛒 Add to Cart
          </button>


          <button
            className="wishlist-btn"
            onClick={addToWishlist}
            title="Add to Wishlist"
          >
            ❤️
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;