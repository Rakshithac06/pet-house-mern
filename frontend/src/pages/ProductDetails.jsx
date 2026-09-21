import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // --------------------------------
  // GET PRODUCT
  // --------------------------------

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/products/${id}`);

        console.log("Product details:", response.data);

        const productData =
          response.data.product ||
          response.data.data ||
          response.data;

        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  useEffect(() => {
  const getReviews = async () => {
    try {
      setReviewsLoading(true);

      const response = await api.get(
        `/reviews/product/${id}`
      );

      setReviews(response.data?.reviews || []);

    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  getReviews();
}, [id]);

const handleSubmitReview = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to write a review.");
    navigate("/login");
    return;
  }

  if (!reviewComment.trim()) {
    alert("Please write a review.");
    return;
  }

  try {
    setReviewSubmitting(true);

    const response = await api.post("/reviews", {
      productId: id,
      rating: Number(reviewRating),
      comment: reviewComment.trim()
    });

    if (response.data.success) {
      alert("Review added successfully! ⭐");

      setReviewComment("");
      setReviewRating(5);

      // Refresh reviews
      const reviewsResponse = await api.get(
        `/reviews/product/${id}`
      );

      setReviews(reviewsResponse.data?.reviews || []);
    }

  } catch (error) {
    console.error("Submit review error:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert("Your session has expired. Please login again.");
      navigate("/login");
      return;
    }

    alert(
      error.response?.data?.message ||
      "Unable to submit review."
    );

  } finally {
    setReviewSubmitting(false);
  }
};

const handleDeleteReview = async (reviewId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to delete your review.");
    navigate("/login");
    return;
  }

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this review?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await api.delete(
      `/reviews/${reviewId}`
    );

    if (response.data.success) {
      alert("Review deleted successfully! 🗑️");

      setReviews(
        reviews.filter(
          (review) => review._id !== reviewId
        )
      );
    }

  } catch (error) {
    console.error("Delete review error:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert("Your session has expired. Please login again.");
      navigate("/login");
      return;
    }

    alert(
      error.response?.data?.message ||
      "Unable to delete review."
    );
  }
};

  // --------------------------------
  // ADD TO CART
  // --------------------------------

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    // User must login
    if (!token) {
      alert("Please login to add products to your cart.");
      navigate("/login");
      return;
    }

    try {
      setCartLoading(true);
      setMessage("");
      setMessageType("");

      const response = await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      console.log("ADD TO CART RESPONSE:", response.data);

      setMessage(
        "Product added to cart successfully! 🛒"
      );
      setMessageType("success");
    } catch (error) {
      console.error("Add to cart error:", error);

      // Session expired
      if (error.response?.status === 401) {
        alert(
          "Your session has expired. Please login again."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to add product to cart."
      );

      setMessageType("error");
    } finally {
      setCartLoading(false);
    }
  };

  // --------------------------------
  // ADD TO WISHLIST
  // --------------------------------

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");

    // User must login
    if (!token) {
      alert(
        "Please login to add products to your wishlist."
      );
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);
      setMessage("");
      setMessageType("");

      const response = await api.post("/wishlist", {
        productId: product._id,
      });

      console.log(
        "ADD TO WISHLIST RESPONSE:",
        response.data
      );

      setMessage("Added to your wishlist! ❤️");
      setMessageType("success");
    } catch (error) {
      console.error(
        "Add to wishlist error:",
        error
      );

      // Session expired
      if (error.response?.status === 401) {
        alert(
          "Your session has expired. Please login again."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to add product to wishlist."
      );

      setMessageType("error");
    } finally {
      setWishlistLoading(false);
    }
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="details-loading">
          <div className="loading-paw">🐾</div>

          <h2>Loading product...</h2>

          <p>
            Fetching the perfect product for your pet.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error) {
    return (
      <div className="product-details-page">
        <div className="details-error">
          <div>🐾</div>

          <h2>{error}</h2>

          <Link
            to="/products"
            className="primary-button"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // --------------------------------
  // PRODUCT NOT FOUND
  // --------------------------------

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="details-error">
          <div>🐶</div>

          <h2>Product not found.</h2>

          <Link
            to="/products"
            className="primary-button"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = product.image
    ? `/images/${product.image}`
    : "";

    const averageRating =
  reviews.length > 0
    ? (
        reviews.reduce(
          (total, review) =>
            total + Number(review.rating),
          0
        ) / reviews.length
      ).toFixed(1)
    : "0.0";

  // --------------------------------
  // PAGE
  // --------------------------------

  return (
    <div className="product-details-page">

      {/* Breadcrumb */}

      <div className="product-breadcrumb">
        <Link to="/">Home</Link>

        <span>›</span>

        <Link to="/products">
          Products
        </Link>

        <span>›</span>

        <span>{product.name}</span>
      </div>


      <div className="product-details-container">

        {/* =========================
            IMAGE SECTION
        ========================== */}

        <div className="product-details-image-wrapper">

          <div className="product-details-badge">
            🐾 Pet House Choice
          </div>

          <div className="product-details-image">

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <div className="product-details-placeholder">
                🐶
              </div>
            )}

          </div>

        </div>


        {/* =========================
            PRODUCT INFORMATION
        ========================== */}

        <div className="product-details-info">

          <div className="details-category">
            🐾 Pet Product
          </div>

          <h1>
            {product.name}
          </h1>

          <div className="details-rating">
  ⭐ {averageRating}

  <span>
    {reviews.length > 0
      ? `${reviews.length} ${
          reviews.length === 1
            ? "review"
            : "reviews"
        }`
      : "No reviews yet"}
  </span>
</div>

          <div className="details-price">
            ₹{product.price}
          </div>

          <p className="details-description">
            {product.description}
          </p>


          {/* Stock */}

          {product.stock !== undefined && (
            <div className="details-stock">

              {product.stock > 0 ? (
                <>
                  <span className="stock-dot"></span>

                  {product.stock} items available
                </>
              ) : (
                <>
                  <span className="out-stock-dot"></span>

                  Out of stock
                </>
              )}

            </div>
          )}


          {/* Message */}

          {message && (
            <div
              className={
                messageType === "success"
                  ? "details-message success"
                  : "details-message error"
              }
            >
              {message}
            </div>
          )}


          {/* Buttons */}

          <div className="details-actions">

            <button
              className="details-cart-button"
              onClick={handleAddToCart}
              disabled={
                cartLoading ||
                product.stock === 0
              }
            >
              {cartLoading
                ? "Adding..."
                : "🛒 Add to Cart"}
            </button>


            <button
              className="details-wishlist-button"
              onClick={handleAddToWishlist}
              disabled={wishlistLoading}
            >
              {wishlistLoading
                ? "Adding..."
                : "❤️ Wishlist"}
            </button>

          </div>


          {/* Features */}

          <div className="details-features">

            <div className="details-feature">

              <span>🚚</span>

              <div>
                <strong>
                  Fast Delivery
                </strong>

                <p>
                  Quick & reliable delivery
                </p>
              </div>

            </div>


            <div className="details-feature">

              <span>🔒</span>

              <div>
                <strong>
                  Secure Shopping
                </strong>

                <p>
                  Safe & secure checkout
                </p>
              </div>

            </div>


            <div className="details-feature">

              <span>❤️</span>

              <div>
                <strong>
                  Pet Approved
                </strong>

                <p>
                  Quality products for pets
                </p>
              </div>

            </div>

          </div>


          <Link
            to="/products"
            className="back-products"
          >
            ← Continue Shopping
          </Link>

        </div>

      </div>

      {/* =========================
          REVIEWS SECTION
      ========================== */}

      <section className="product-reviews-section">

        <div className="reviews-header">
          <h2>Customer Reviews ⭐</h2>

          <p>
            See what other pet parents think about this product.
          </p>
        </div>


        {/* Write Review */}

        <div className="write-review-card">

          <h3>Write a Review</h3>

          <form onSubmit={handleSubmitReview}>

            <div className="review-rating-input">

              <label>Your Rating</label>

              <div className="star-selector">

                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={
                      star <= reviewRating
                        ? "star active"
                        : "star"
                    }
                    onClick={() =>
                      setReviewRating(star)
                    }
                  >
                    ★
                  </button>
                ))}

              </div>

            </div>


            <div className="form-group">

              <label>Your Review</label>

              <textarea
                value={reviewComment}
                onChange={(e) =>
                  setReviewComment(e.target.value)
                }
                placeholder="Share your experience with this product..."
                rows="4"
                required
              />

            </div>


            <button
              type="submit"
              className="review-submit-button"
              disabled={reviewSubmitting}
            >
              {reviewSubmitting
                ? "Submitting..."
                : "Submit Review ⭐"}
            </button>

          </form>

        </div>


        {/* Existing Reviews */}

        <div className="reviews-list">

          {reviewsLoading ? (
            <div className="reviews-loading">
              Loading reviews... 🐾
            </div>
          ) : reviews.length === 0 ? (
            <div className="no-reviews">
              <div>💬</div>

              <h3>No reviews yet</h3>

              <p>
                Be the first to review this product!
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                className="review-card"
                key={review._id}
              >

                <div className="review-card-header">

                  <div className="review-user">
                    <div className="review-avatar">
                      {review.user?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <strong>
                        {review.user?.name || "Pet Parent"}
                      </strong>

                      <div className="review-stars">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>

                  </div>

                  <span className="review-date">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString("en-IN")}
                  </span>

                </div>


                <p className="review-comment">
                  {review.comment}
                </p>

                {(() => {
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (
    currentUser &&
    review.user?._id === currentUser.id
  ) {
    return (
      <button
        type="button"
        className="delete-review-button"
        onClick={() =>
          handleDeleteReview(review._id)
        }
      >
        🗑️ Delete Review
      </button>
    );
  }

  return null;
})()}

              </div>
            ))
          )}

        </div>

      </section>

    </div>
   
  );
}

export default ProductDetails;