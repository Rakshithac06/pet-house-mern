import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Checkout() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {

    loadCart();

  }, []);


  const loadCart = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {

      const response = await api.get("/cart");

      const items =
        response.data?.cart?.items || [];

      setCart(items);

    } catch (error) {

      console.error(
        "Checkout cart error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load cart."
      );

    } finally {

      setLoading(false);

    }
  };


  const handleChange = (e) => {

    const { name, value } = e.target;

    setShippingAddress({
      ...shippingAddress,
      [name]: value
    });

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


  const placeOrder = async (e) => {

    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {

      setPlacingOrder(true);
      setError("");

      const response = await api.post(
        "/orders",
        {
          shippingAddress,
          paymentMethod: "COD"
        }
      );

      console.log(
        "ORDER RESPONSE:",
        response.data
      );

      if (response.data.success) {

        alert("Order placed successfully! 🎉");

        navigate("/orders");

      }

    } catch (error) {

      console.error(
        "Place order error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to place order."
      );

    } finally {

      setPlacingOrder(false);

    }
  };


  if (loading) {

    return (
      <div className="inner-page">

        <div className="inner-page-title">

          <h1>
            Checkout 🛍️
          </h1>

          <p>
            Loading checkout...
          </p>

        </div>

      </div>
    );

  }


  if (cart.length === 0) {

    return (
      <div className="inner-page">

        <div className="empty-state">

          <div className="empty-state-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add products before proceeding
            to checkout.
          </p>

          <br />

          <Link
            to="/products"
            className="primary-button"
          >
            Shop Products
          </Link>

        </div>

      </div>
    );

  }


  return (

    <div className="inner-page">

      <div className="inner-page-title">

        <h1>
          Checkout 🛍️
        </h1>

        <p>
          Complete your order
        </p>

      </div>


      <div className="checkout-container">


        {/* Shipping Address */}

        <div className="checkout-form-card">

          <h2>
            Delivery Address
          </h2>


          <form onSubmit={placeOrder}>

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={shippingAddress.name}
                onChange={handleChange}
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
                name="phone"
                value={shippingAddress.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Address
              </label>

              <textarea
                name="address"
                value={shippingAddress.address}
                onChange={handleChange}
                placeholder="House number, street, area"
                required
              />

            </div>


            <div className="checkout-row">

              <div className="form-group">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                />

              </div>

            </div>


            <div className="form-group">

              <label>
                Pincode
              </label>

              <input
                type="text"
                name="pincode"
                value={shippingAddress.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                required
              />

            </div>


            <h2 className="payment-title">
              Payment Method
            </h2>


           <div className="payment-options">

  <label>
    <input
      type="radio"
      value="COD"
      checked
      readOnly
    />

    💵 Cash on Delivery

  </label>

</div>


            {error && (

              <div className="error-message">
                {error}
              </div>

            )}


            <button
              type="submit"
              className="form-submit"
              disabled={placingOrder}
            >

              {placingOrder
                ? "Placing Order..."
                : `Place Order → ₹${total}`
              }

            </button>

          </form>

        </div>


        {/* Order Summary */}

        <div className="summary-card">

          <h2>
            Order Summary
          </h2>


          {cart.map(item => (

            <div
              className="summary-row"
              key={item.product._id}
            >

              <span>
                {item.product.name}
                {" × "}
                {item.quantity}
              </span>

              <span>
                ₹
                {Number(item.product.price) *
                  item.quantity}
              </span>

            </div>

          ))}


          <hr />


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

        </div>

      </div>

    </div>

  );
}

export default Checkout;