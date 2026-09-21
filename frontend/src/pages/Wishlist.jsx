import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Wishlist() {

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(null); 


  useEffect(() => {
    loadWishlist();
  }, []);


  const loadWishlist = async () => {

    try {

      const response = await api.get("/wishlist");

      console.log("WISHLIST RESPONSE:", response.data);

      const products =
        response.data?.wishlist?.products || [];

      setWishlist(products);

    } catch (error) {

      console.error("WISHLIST ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load wishlist."
      );

    } finally {

      setLoading(false);

    }
  };


  const remove = async (id) => {

    try {

      await api.delete(`/wishlist/${id}`);

      setWishlist(
        wishlist.filter(
          product => product._id !== id
        )
      );

    } catch (error) {

      console.error(
        "REMOVE WISHLIST ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to remove product."
      );

    }
  };

  const addToCart = async (productId) => {
  try {
    setAddingToCart(productId);

    const response = await api.post("/cart", {
      productId,
      quantity: 1
    });

    if (response.data.success) {
      alert("Product added to cart! 🛒❤️");
    }

  } catch (error) {

    console.error(
      "ADD TO CART ERROR:",
      error
    );

    alert(
      error.response?.data?.message ||
      "Unable to add product to cart."
    );

  } finally {
    setAddingToCart(null);
  }
};


  if (loading) {

    return (
      <div className="wishlist-page">

        <div className="wishlist-header">

          <h1>
            My Wishlist ❤️
          </h1>

          <p>
            Loading your favourite products...
          </p>

        </div>

      </div>
    );

  }


  if (error) {

    return (
      <div className="wishlist-page">

        <div className="wishlist-header">

          <h1>
            My Wishlist ❤️
          </h1>

          <p className="wishlist-error">
            {error}
          </p>

        </div>

      </div>
    );

  }


  return (

    <div className="wishlist-page">

      <div className="wishlist-header">

        <h1>
          My Wishlist <span>❤️</span>
        </h1>

        <p>
          Your favourite products, saved for later
        </p>

      </div>


      {wishlist.length === 0 ? (

        <div className="empty-state">

          <div className="empty-state-icon">
            ❤️
          </div>

          <h2>
            Your wishlist is empty
          </h2>

          <p>
            Add products you love to your wishlist.
          </p>

          <Link
            to="/products"
            className="primary-button"
          >
            Browse Products
          </Link>

        </div>

      ) : (

        <>

          <div className="wishlist-count">

            {wishlist.length}
            {" "}
            {wishlist.length === 1
              ? "Product"
              : "Products"}
            {" "}Saved ❤️

          </div>


          <div className="wishlist-grid">

            {wishlist.map(product => {

              const imageUrl = product.image
                ? `/images/${product.image}`
                : "";


              return (

                <div
                  className="wishlist-card"
                  key={product._id}
                >

                  <Link
                    to={`/products/${product._id}`}
                    className="wishlist-image-link"
                  >

                    <div className="wishlist-image">

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

                        <div className="product-placeholder">
                          🐶
                        </div>

                      )}

                    </div>

                  </Link>


                  <div className="wishlist-info">

                    <div>

                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        {product.description}
                      </p>

                    </div>


                    <div className="wishlist-bottom">

  <span className="wishlist-price">
    ₹{product.price}
  </span>

  <div className="wishlist-actions">

    <button
      className="wishlist-add-cart-btn"
      onClick={() =>
        addToCart(product._id)
      }
      disabled={addingToCart === product._id}
    >
      {addingToCart === product._id
        ? "Adding..."
        : "🛒 Add to Cart"}
    </button>

    <button
      className="remove-wishlist-btn"
      onClick={() =>
        remove(product._id)
      }
    >
      🗑️ Remove
    </button>

  </div>

</div>

                  </div>

                </div>

              );

            })}

          </div>

        </>

      )}

    </div>
  );
}

export default Wishlist;