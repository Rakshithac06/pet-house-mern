import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
    name: "",
    description: "",
    image: ""
};

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(emptyForm);

    const [editingCategory, setEditingCategory] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/categories");

            setCategories(
                response.data?.categories ||
                response.data ||
                []
            );
        } catch (error) {
            console.error("Load categories error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load categories."
            );
        } finally {
            setLoading(false);
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

            let response;

            if (editingCategory) {
                response = await api.put(
                    `/categories/${editingCategory._id}`,
                    formData
                );
            } else {
                response = await api.post(
                    "/categories",
                    formData
                );
            }

            if (response.data.success) {
                alert(
                    editingCategory
                        ? "Category updated successfully! 🏷️🎉"
                        : "Category added successfully! 🏷️🎉"
                );

                setFormData(emptyForm);
                setEditingCategory(null);
                setShowForm(false);

                loadCategories();
            }

        } catch (error) {
            console.error(
                editingCategory
                    ? "Update category error:"
                    : "Add category error:",
                error
            );

            setError(
                error.response?.data?.message ||
                (
                    editingCategory
                        ? "Unable to update category."
                        : "Unable to add category."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);

        setFormData({
            name: category.name || "",
            description: category.description || "",
            image: category.image || ""
        });

        setShowForm(true);
    };

    const handleDeleteCategory = async (categoryId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await api.delete(
                `/categories/${categoryId}`
            );

            if (response.data.success) {
                alert("Category deleted successfully! 🗑️");

                loadCategories();
            }

        } catch (error) {
            console.error(
                "Delete category error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete category."
            );
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingCategory(null);
        setFormData(emptyForm);
        setError("");
    };

    return (
        <div className="admin-categories-page">

            <div className="admin-categories-header">

                <div>
                    <p className="admin-categories-label">
                        CATEGORY MANAGEMENT
                    </p>

                    <h1>Manage Categories 🏷️</h1>

                    <p>
                        Create and manage categories for your
                        Pet House products.
                    </p>
                </div>

                <button
                    className="admin-add-category-btn"
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData(emptyForm);
                        setShowForm(true);
                    }}
                >
                    + Add Category
                </button>

            </div>

            {error && (
                <div className="admin-categories-error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="admin-categories-loading">
                    Loading categories...
                </div>
            ) : categories.length === 0 ? (
                <div className="admin-categories-empty">

                    <div className="admin-categories-empty-icon">
                        🏷️
                    </div>

                    <h2>No Categories Found</h2>

                    <p>
                        Start by adding your first product category.
                    </p>

                    <button
                        className="admin-add-category-btn"
                        onClick={() => setShowForm(true)}
                    >
                        + Add Category
                    </button>

                </div>
            ) : (
                <div className="admin-categories-grid">

                    {categories.map((category) => (
                        <div
                            className="admin-category-card"
                            key={category._id}
                        >

                            <div className="admin-category-image">

                                {category.image ? (
                                    <img
                                        src={`/images/${category.image}`}
                                        alt={category.name}
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                ) : (
                                    <span>🐾</span>
                                )}

                            </div>

                            <div className="admin-category-content">

                                <h2>
                                    {category.name}
                                </h2>

                                <p>
                                    {category.description ||
                                        "No description available."}
                                </p>

                                <div className="admin-category-actions">

                                    <button
                                        className="admin-edit-category-btn"
                                        onClick={() =>
                                            handleEditClick(category)
                                        }
                                    >
                                        ✏️ Edit
                                    </button>

                                    <button
                                        className="admin-delete-category-btn"
                                        onClick={() =>
                                            handleDeleteCategory(
                                                category._id
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
                <div className="admin-category-form-overlay">

                    <div className="admin-category-form-card">

                        <div className="admin-category-form-header">

                            <div>
                                <p>
                                    {editingCategory
                                        ? "EDIT CATEGORY"
                                        : "NEW CATEGORY"}
                                </p>

                                <h2>
                                    {editingCategory
                                        ? "Edit Category ✏️"
                                        : "Add New Category 🏷️"}
                                </h2>
                            </div>

                            <button
                                className="admin-category-form-close"
                                onClick={closeForm}
                            >
                                ✕
                            </button>

                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="admin-category-form-grid">

                                <div className="admin-category-form-group">

                                    <label>
                                        Category Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Pet Food"
                                        required
                                    />

                                </div>

                                <div className="admin-category-form-group">

                                    <label>
                                        Image Filename
                                    </label>

                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="e.g. pet-food.jpg"
                                    />

                                    <small>
                                        Use an image filename from
                                        public/images
                                    </small>

                                </div>

                                <div className="admin-category-form-group admin-category-form-full">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter category description"
                                        rows="4"
                                    />

                                </div>

                            </div>

                            <div className="admin-category-form-actions">

                                <button
                                    type="button"
                                    className="admin-cancel-category-btn"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-save-category-btn"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingCategory
                                        ? "Update Category"
                                        : "Add Category"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminCategories;