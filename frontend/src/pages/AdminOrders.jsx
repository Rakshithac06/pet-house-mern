import { useEffect, useState } from "react";
import api from "../services/api";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [updatingOrder, setUpdatingOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/orders");

            setOrders(response.data?.orders || []);
        } catch (error) {
            console.error("Load admin orders error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load orders."
            );
        } finally {
            setLoading(false);
        }
    };

    const updateOrder = async (
        orderId,
        field,
        value
    ) => {
        try {
            setUpdatingOrder(orderId);

            const response = await api.put(
                `/admin/orders/${orderId}`,
                {
                    [field]: value
                }
            );

            if (response.data.success) {
                alert("Order updated successfully! ✅");

                loadOrders();
            }
        } catch (error) {
            console.error(
                "Update order error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update order."
            );
        } finally {
            setUpdatingOrder(null);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const getStatusClass = (status) => {
        return status
            ?.toLowerCase()
            .replace(/\s+/g, "-");
    };

    return (
        <div className="admin-orders-page">

            <div className="admin-orders-header">

                <div>
                    <p className="admin-orders-label">
                        ORDER MANAGEMENT
                    </p>

                    <h1>Manage Orders 📦</h1>

                    <p>
                        View customer orders and manage
                        order and payment status.
                    </p>
                </div>

                <button
                    className="admin-refresh-orders-btn"
                    onClick={loadOrders}
                >
                    🔄 Refresh
                </button>

            </div>

            {error && (
                <div className="admin-orders-error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="admin-orders-loading">
                    Loading orders...
                </div>
            ) : orders.length === 0 ? (
                <div className="admin-orders-empty">

                    <div className="admin-orders-empty-icon">
                        📦
                    </div>

                    <h2>No Orders Found</h2>

                    <p>
                        Customer orders will appear here.
                    </p>

                </div>
            ) : (
                <div className="admin-orders-list">

                    {orders.map((order) => (
                        <div
                            className="admin-order-card"
                            key={order._id}
                        >

                            {/* Order Header */}

                            <div className="admin-order-header">

                                <div>
                                    <span className="admin-order-label">
                                        ORDER ID
                                    </span>

                                    <h2>
                                        #{order._id.slice(-8).toUpperCase()}
                                    </h2>

                                    <p>
                                        Placed on{" "}
                                        {formatDate(
                                            order.createdAt
                                        )}
                                    </p>
                                </div>

                                <div className="admin-order-statuses">

                                    <span
                                        className={`admin-order-status ${getStatusClass(
                                            order.orderStatus
                                        )}`}
                                    >
                                        {order.orderStatus}
                                    </span>

                                    <span
                                        className={`admin-payment-status ${getStatusClass(
                                            order.paymentStatus
                                        )}`}
                                    >
                                        Payment:{" "}
                                        {order.paymentStatus}
                                    </span>

                                </div>

                            </div>

                            {/* Customer */}

                            <div className="admin-order-customer">

                                <div>
                                    <span>
                                        CUSTOMER
                                    </span>

                                    <strong>
                                        {order.user?.name ||
                                            "Unknown Customer"}
                                    </strong>

                                    <p>
                                        {order.user?.email ||
                                            "No email available"}
                                    </p>
                                </div>

                                <div>
                                    <span>
                                        PAYMENT METHOD
                                    </span>

                                    <strong>
                                        {order.paymentMethod}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        TOTAL
                                    </span>

                                    <strong className="admin-order-total">
                                        ₹
                                        {Number(
                                            order.totalAmount
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>

                            </div>

                            {/* Products */}

                            <div className="admin-order-products">

                                <h3>
                                    Ordered Products
                                </h3>

                                {order.items?.map(
                                    (item, index) => (
                                        <div
                                            className="admin-order-product"
                                            key={
                                                item.product?._id ||
                                                index
                                            }
                                        >

                                            <div className="admin-order-product-image">

                                                {item.product?.image ? (
                                                    <img
                                                        src={`/images/${item.product.image}`}
                                                        alt={
                                                            item.product.name
                                                        }
                                                    />
                                                ) : (
                                                    <span>
                                                        🐾
                                                    </span>
                                                )}

                                            </div>

                                            <div className="admin-order-product-details">

                                                <strong>
                                                    {item.product?.name ||
                                                        "Product unavailable"}
                                                </strong>

                                                <span>
                                                    Quantity:{" "}
                                                    {item.quantity}
                                                </span>

                                            </div>

                                            <strong>
                                                ₹
                                                {(
                                                    Number(
                                                        item.price
                                                    ) *
                                                    Number(
                                                        item.quantity
                                                    )
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                        </div>
                                    )
                                )}

                            </div>

                            {/* Shipping Address */}

                            <div className="admin-order-shipping">

                                <h3>
                                    📍 Shipping Address
                                </h3>

                                <p>
                                    <strong>
                                        {order.shippingAddress?.name}
                                    </strong>
                                    <br />

                                    {order.shippingAddress?.phone}
                                    <br />

                                    {order.shippingAddress?.address}
                                    <br />

                                    {order.shippingAddress?.city},{" "}
                                    {order.shippingAddress?.state} -{" "}
                                    {order.shippingAddress?.pincode}
                                </p>

                            </div>

                            {/* Management */}

                            <div className="admin-order-management">

                                <div className="admin-order-control">

                                    <label>
                                        Order Status
                                    </label>

                                    <select
                                        value={
                                            order.orderStatus
                                        }
                                        disabled={
                                            updatingOrder ===
                                            order._id
                                        }
                                        onChange={(e) =>
                                            updateOrder(
                                                order._id,
                                                "orderStatus",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Confirmed">
                                            Confirmed
                                        </option>

                                        <option value="Shipped">
                                            Shipped
                                        </option>

                                        <option value="Delivered">
                                            Delivered
                                        </option>

                                        <option value="Cancelled">
                                            Cancelled
                                        </option>
                                    </select>

                                </div>

                                <div className="admin-order-control">

                                    <label>
                                        Payment Status
                                    </label>

                                    <select
                                        value={
                                            order.paymentStatus
                                        }
                                        disabled={
                                            updatingOrder ===
                                            order._id
                                        }
                                        onChange={(e) =>
                                            updateOrder(
                                                order._id,
                                                "paymentStatus",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Paid">
                                            Paid
                                        </option>

                                        <option value="Failed">
                                            Failed
                                        </option>
                                    </select>

                                </div>

                                {updatingOrder ===
                                    order._id && (
                                    <span className="admin-order-updating">
                                        Updating...
                                    </span>
                                )}

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default AdminOrders;