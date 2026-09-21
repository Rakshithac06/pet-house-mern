import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    loadOrders();

  }, []);


  const loadOrders = async () => {

    const token = localStorage.getItem("token");

    if (!token) {

      setLoading(false);
      setError("Please login to view your orders.");

      return;
    }


    try {

      const response = await api.get("/orders");

      console.log(
        "ORDERS RESPONSE:",
        response.data
      );


      const orderData =
        response.data?.orders || [];


      setOrders(orderData);

    } catch (error) {

      console.error(
        "Load orders error:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Unable to load your orders."
      );

    } finally {

      setLoading(false);

    }
  };


  const cancelOrder = async (orderId) => {

    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );


    if (!confirmCancel) {
      return;
    }


    try {

      const response = await api.put(
        `/orders/${orderId}/cancel`
      );


      console.log(
        "CANCEL ORDER RESPONSE:",
        response.data
      );


      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? {
                ...order,
                orderStatus:
                  response.data.order?.orderStatus ||
                  "Cancelled"
              }
            : order
        )
      );


      alert("Order cancelled successfully.");

    } catch (error) {

      console.error(
        "Cancel order error:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Unable to cancel order."
      );

    }
  };


  if (loading) {

    return (

      <div className="inner-page">

        <div className="inner-page-title">

          <h1>
            My Orders 📦
          </h1>

          <p>
            Loading your orders...
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
            My Orders 📦
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
          My Orders 📦
        </h1>

        <p>
          Track your orders and their status
        </p>

      </div>


      {orders.length === 0 ? (

        <div className="empty-state">

          <div className="empty-state-icon">
            📦
          </div>

          <h2>
            No orders yet
          </h2>

          <p>
            Your placed orders will appear here.
          </p>

          <br />

          <Link
            to="/products"
            className="primary-button"
          >
            Start Shopping
          </Link>

        </div>

      ) : (

        <div className="orders-container">

          {orders.map(order => (

            <div
              className="order-card"
              key={order._id}
            >

              {/* Order Header */}

              <div className="order-header">

                <div>

                  <h3>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h3>

                  <p>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>

                </div>


                <div
                  className={`order-status ${order.orderStatus
                    ?.toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {order.orderStatus}
                </div>

              </div>


              {/* Products */}

              <div className="order-products">

                {order.items?.map(item => {

                  const product =
                    item.product;


                  return (

                    <div
                      className="order-product"
                      key={product?._id}
                    >

                      <div className="order-product-image">

                        {product?.image ? (

                          <img
                            src={`/images/${product.image}`}
                            alt={product.name}
                          />

                        ) : (

                          <span>
                            🐶
                          </span>

                        )}

                      </div>


                      <div className="order-product-info">

                        <h4>
                          {product?.name ||
                            "Product"}
                        </h4>

                        <p>
                          ₹{item.price}
                        </p>

                        <span>
                          Quantity: {item.quantity}
                        </span>

                      </div>


                      <div className="order-product-total">

                        ₹
                        {Number(item.price) *
                          Number(item.quantity)}

                      </div>

                    </div>

                  );

                })}

              </div>


              {/* Order Footer */}

              <div className="order-footer">

                <div>

                  <span>
                    Payment
                  </span>

                  <strong>
                    {order.paymentMethod}
                  </strong>

                </div>


                <div>

                  <span>
                    Payment Status
                  </span>

                  <strong>
                    {order.paymentStatus}
                  </strong>

                </div>


                <div className="order-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹{order.totalAmount}
                  </strong>

                </div>

              </div>


              {/* Cancel */}

              {order.orderStatus !== "Delivered" &&
                order.orderStatus !== "Cancelled" && (

                <button
                  className="remove-button"
                  onClick={() =>
                    cancelOrder(order._id)
                  }
                >
                  Cancel Order
                </button>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default Orders;