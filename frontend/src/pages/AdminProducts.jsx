import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
    brand: ""
};

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(emptyForm);

    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/products");

            setProducts(response.data?.products || response.data || []);
        } catch (error) {
            console.error("Load products error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await api.get("/categories");

            setCategories(
                response.data?.categories ||
                response.data ||
                []
            );
        } catch (error) {
            console.error("Load categories error:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            const dataToSend = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                image: formData.image,
                category: formData.category,
                stock: Number(formData.stock),
                brand: formData.brand
            };

            let response;

            if (editingProduct) {
                response = await api.put(
                    `/products/${editingProduct._id}`,
                    dataToSend
                );
            } else {
                response = await api.post(
                    "/products",
                    dataToSend
                );
            }

            if (response.data.success !== false) {
                alert(
                    editingProduct
                        ? "Product updated successfully! 🛍️🎉"
                        : "Product added successfully! 🛍️🎉"
                );

                setFormData(emptyForm);
                setEditingProduct(null);
                setShowForm(false);

                loadProducts();
            }
        } catch (error) {
            console.error(
                editingProduct
                    ? "Update product error:"
                    : "Add product error:",
                error
            );

            setError(
                error.response?.data?.message ||
                (
                    editingProduct
                        ? "Unable to update product."
                        : "Unable to add product."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);

        setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price ?? "",
            image: product.image || "",
            category:
                product.category?._id ||
                product.category ||
                "",
            stock: product.stock ?? "",
            brand: product.brand || ""
        });

        setShowForm(true);
    };

    const handleDeleteProduct = async (productId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await api.delete(
                `/products/${productId}`
            );

            if (response.data.success !== false) {
                alert("Product deleted successfully! 🗑️");

                loadProducts();
            }
        } catch (error) {
            console.error("Delete product error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to delete product."
            );
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setFormData(emptyForm);
        setError("");
    };

    const getCategoryName = (category) => {
        if (!category) {
            return "Uncategorized";
        }

        if (typeof category === "object") {
            return category.name || "Uncategorized";
        }

        const foundCategory = categories.find(
            (item) => item._id === category
        );

        return foundCategory?.name || "Uncategorized";
    };

    return (
        <div className="admin-products-page">

            <div className="admin-products-header">
                <div>
                    <p className="admin-products-label">
                        PRODUCT MANAGEMENT
                    </p>

                    <h1>Manage Products 🛍️</h1>

                    <p>
                        Add, edit and manage pet products available
                        in your Pet House store.
                    </p>
                </div>

                <button
                    className="admin-add-product-btn"
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData(emptyForm);
                        setShowForm(true);
                    }}
                >
                    + Add Product
                </button>
            </div>

            {error && (
                <div className="admin-products-error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="admin-products-loading">
                    Loading products...
                </div>
            ) : products.length === 0 ? (
                <div className="admin-products-empty">
                    <div className="admin-products-empty-icon">
                        🛍️
                    </div>

                    <h2>No Products Found</h2>

                    <p>
                        Start by adding your first pet product.
                    </p>

                    <button
                        className="admin-add-product-btn"
                        onClick={() => setShowForm(true)}
                    >
                        + Add Product
                    </button>
                </div>
            ) : (
                <div className="admin-products-grid">
                    {products.map((product) => (
                        <div
                            className="admin-product-card"
                            key={product._id}
                        >
                            <div className="admin-product-image">
                                {product.image ? (
                                    <img
                                        src={`/images/${product.image}`}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                ) : (
                                    <span>🐾</span>
                                )}
                            </div>

                            <div className="admin-product-content">

                                <div className="admin-product-top">
                                    <span className="admin-product-category">
                                        {getCategoryName(
                                            product.category
                                        )}
                                    </span>

                                    <span
                                        className={
                                            product.stock > 0
                                                ? "admin-stock available"
                                                : "admin-stock out"
                                        }
                                    >
                                        {product.stock > 0
                                            ? `Stock: ${product.stock}`
                                            : "Out of Stock"}
                                    </span>
                                </div>

                                <h2>{product.name}</h2>

                                <p className="admin-product-description">
                                    {product.description}
                                </p>

                                <div className="admin-product-info">
                                    <strong>
                                        ₹{Number(product.price).toLocaleString("en-IN")}
                                    </strong>

                                    {product.brand && (
                                        <span>
                                            {product.brand}
                                        </span>
                                    )}
                                </div>

                                <div className="admin-product-actions">
                                    <button
                                        className="admin-edit-product-btn"
                                        onClick={() =>
                                            handleEditClick(product)
                                        }
                                    >
                                        ✏️ Edit
                                    </button>

                                    <button
                                        className="admin-delete-product-btn"
                                        onClick={() =>
                                            handleDeleteProduct(
                                                product._id
                                            )
                                        }
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="admin-product-form-overlay">

                    <div className="admin-product-form-card">

                        <div className="admin-product-form-header">
                            <div>
                                <p>
                                    {editingProduct
                                        ? "EDIT PRODUCT"
                                        : "NEW PRODUCT"}
                                </p>

                                <h2>
                                    {editingProduct
                                        ? "Edit Product ✏️"
                                        : "Add New Product 🛍️"}
                                </h2>
                            </div>

                            <button
                                className="admin-form-close"
                                onClick={closeForm}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="admin-product-form-grid">

                                <div className="admin-form-group">
                                    <label>
                                        Product Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>
                                        Brand
                                    </label>

                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        placeholder="Enter brand"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>
                                        Price *
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="Enter price"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>
                                        Stock *
                                    </label>

                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="Enter stock quantity"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>
                                        Category *
                                    </label>

                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select Category
                                        </option>

                                        {categories.map(
                                            (category) => (
                                                <option
                                                    key={category._id}
                                                    value={category._id}
                                                >
                                                    {category.name}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="admin-form-group">
                                    <label>
                                        Image Filename
                                    </label>

                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="e.g. dog-food.jpg"
                                    />

                                    <small>
                                        Use an image filename from
                                        public/images
                                    </small>
                                </div>

                                <div className="admin-form-group admin-form-full">
                                    <label>
                                        Description *
                                    </label>

                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter product description"
                                        rows="4"
                                        required
                                    />
                                </div>

                            </div>

                            <div className="admin-product-form-actions">

                                <button
                                    type="button"
                                    className="admin-cancel-product-btn"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-save-product-btn"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingProduct
                                        ? "Update Product"
                                        : "Add Product"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminProducts;