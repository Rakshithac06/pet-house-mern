import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Cart() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    loadCart();
  }, []);


  const loadCart = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      setError("Please login to view your cart.");
      return;
    }

    try {

      const response = await api.get("/cart");

      console.log("CART RESPONSE:", response.data);

      const items =
        response.data?.cart?.items || [];

      setCart(items);

    } catch (error) {

      console.error("Load cart error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load your cart."
      );

    } finally {

      setLoading(false);

    }
  };


  const updateQuantity = async (productId, quantity) => {

    if (quantity < 1) {
      return;
    }

    try {

      const response = await api.put(
        `/cart/${productId}`,
        {
          quantity,
        }
      );

      setCart(
        response.data?.cart?.items || []
      );

    } catch (error) {

      console.error(
        "Update quantity error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to update quantity."
      );

    }
  };


  const increase = (item) => {

    updateQuantity(
      item.product._id,
      item.quantity + 1
    );

  };


  const decrease = (item) => {

    if (item.quantity === 1) {
      remove(item.product._id);
      return;
    }

    updateQuantity(
      item.product._id,
      item.quantity - 1
    );

  };


  const remove = async (productId) => {

    try {

      const response = await api.delete(
        `/cart/${productId}`
      );

      setCart(
        response.data?.cart?.items || []
      );

    } catch (error) {

      console.error(
        "Remove cart item error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to remove product."
      );

    }
  };


  const clearCart = async () => {

    try {

      await api.delete("/cart");

      setCart([]);

    } catch (error) {

      console.error(
        "Clear cart error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to clear cart."
      );

    }
  };


  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.product?.price || 0) *
      Number(item.quantity || 1),
    0
  );


  const shipping =
    subtotal > 0 ? 50 : 0;


  const total =
    subtotal + shipping;


  if (loading) {

    return (
      <div className="inner-page">

        <div className="inner-page-title">

          <h1>
            Your Cart 🛒
          </h1>

          <p>
            Loading your cart...
          </p>

        </div>

      </div>
    );

  }


  if (error) {

    return (
      <div className="inner-page">

        <div className="inner-page-title">

          <h1>
            Your Cart 🛒
          </h1>

          <p>
            {error}
          </p>

          <br />

          <Link
            to="/login"
            className="primary-button"
          >
            Login
          </Link>

        </div>

      </div>
    );

  }


  return (

    <div className="inner-page">

      <div className="inner-page-title">

        <h1>
          Your Cart 🛒
        </h1>

        <p>
          Review your selected products
        </p>

      </div>


      {cart.length === 0 ? (

        <div className="empty-state">

          <div className="empty-state-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add products to your cart
            to continue shopping.
          </p>

          <br />

          <Link
            to="/products"
            className="primary-button"
          >
            Shop Products
          </Link>

        </div>

      ) : (

        <div className="cart-container">

          <div className="cart-items">

            {cart.map((item) => {

              const product = item.product;

              const imageUrl = product?.image
                ? `/images/${product.image}`
                : "";


              return (

                <div
                  className="cart-item"
                  key={product._id}
                >

                  <div className="cart-item-image">

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={product.name}
                      />

                    ) : (

                      <span>
                        🐶
                      </span>

                    )}

                  </div>


                  <div className="cart-item-info">

                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      ₹{product.price}
                    </p>

                  </div>


                  <div className="quantity-controls">

                    <button
                      onClick={() =>
                        decrease(item)
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increase(item)
                      }
                    >
                      +
                    </button>

                  </div>


                  <div className="cart-item-total">

                    ₹
                    {Number(product.price) *
                      item.quantity}

                  </div>


                  <button
                    className="remove-button"
                    onClick={() =>
                      remove(product._id)
                    }
                  >
                    Remove
                  </button>

                </div>

              );

            })}


            <button
              className="clear-cart-button"
              onClick={clearCart}
            >
              Clear Cart
            </button>

          </div>


          <div className="summary-card">

            <h2>
              Order Summary
            </h2>


            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{subtotal}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Shipping
              </span>

              <span>
                ₹{shipping}
              </span>

            </div>


            <div className="summary-total">

              <span>
                Total
              </span>

              <span>
                ₹{total}
              </span>

            </div>


            <button
              className="form-submit"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed to Checkout →
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cart;