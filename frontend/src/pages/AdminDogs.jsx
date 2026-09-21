import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminDogs() {
    const emptyForm = {
        name: "",
        breed: "",
        age: "",
        gender: "Male",
        description: "",
        image: "",
        type: "Sale",
        price: "",
        location: "",
        available: true
    };

    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

   const [showForm, setShowForm] = useState(false);
   const [formData, setFormData] = useState(emptyForm);
   const [addingDog, setAddingDog] = useState(false);
   const [editingDog, setEditingDog] = useState(null);

    const loadDogs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/dogs");

            if (response.data.success) {
                setDogs(response.data.dogs);
            }
        } catch (error) {
            console.error("Admin dogs error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load dogs."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDogs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;

        setFormData((previous) => ({
            ...previous,
            type,
            price: type === "Adoption" ? 0 : ""
        }));
    };

   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setAddingDog(true);
        setError("");

        const dataToSend = {
            ...formData,
            age: Number(formData.age),
            price:
                formData.type === "Adoption"
                    ? 0
                    : Number(formData.price || 0),
            available: Boolean(formData.available)
        };

        let response;

        if (editingDog) {
            response = await api.put(
                `/admin/dogs/${editingDog._id}`,
                dataToSend
            );
        } else {
            response = await api.post(
                "/admin/dogs",
                dataToSend
            );
        }

        if (response.data.success) {
            alert(
                editingDog
                    ? "Dog updated successfully! 🐶🎉"
                    : "Dog added successfully! 🐶🎉"
            );

            setFormData(emptyForm);
            setEditingDog(null);
            setShowForm(false);

            loadDogs();
        }

    } catch (error) {
        console.error(
            editingDog
                ? "Update dog error:"
                : "Add dog error:",
            error
        );

        setError(
            error.response?.data?.message ||
            (
                editingDog
                    ? "Unable to update dog."
                    : "Unable to add dog."
            )
        );
    } finally {
        setAddingDog(false);
    }
};

const handleEditClick = (dog) => {
    setEditingDog(dog);

    setFormData({
        name: dog.name || "",
        breed: dog.breed || "",
        age: dog.age ?? "",
        gender: dog.gender || "Male",
        description: dog.description || "",
        image: dog.image || "",
        type: dog.type || "Sale",
        price: dog.type === "Adoption" ? 0 : dog.price || "",
        location: dog.location || "",
        available: dog.available
    });

    setError("");
    setShowForm(true);
};

const handleDeleteDog = async (dogId) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this dog?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        setError("");

        const response = await api.delete(
            `/admin/dogs/${dogId}`
        );

        if (response.data.success) {
            alert("Dog deleted successfully! 🐶");

            loadDogs();
        }

    } catch (error) {
        console.error("Delete dog error:", error);

        setError(
            error.response?.data?.message ||
            "Unable to delete dog."
        );
    }
};

   const closeForm = () => {
    setShowForm(false);
    setFormData(emptyForm);
    setEditingDog(null);
    setError("");
};

    return (
        <div className="admin-dogs-page">
            <div className="admin-container">

                {/* Header */}
                <div className="admin-dogs-header">
                    <div>
                        <span className="admin-badge">
                            🐾 Pet House Admin
                        </span>

                        <h1>Manage Dogs</h1>

                        <p>
                            Add, update and manage dogs available
                            for sale and adoption.
                        </p>
                    </div>

                    <div className="admin-dogs-header-icon">
                        🐶
                    </div>
                </div>

                {/* Actions */}
                <div className="admin-dogs-actions">
                    <Link
                        to="/admin"
                        className="admin-back-btn"
                    >
                        ← Dashboard
                    </Link>

                    <button
                        className="admin-add-dog-btn"
                        onClick={() => {
                            setError("");
                            setShowForm(true);
                        }}
                    >
                        + Add New Dog
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="admin-error">
                        {error}
                    </div>
                )}

                {/* Add Dog Form */}
                {showForm && (
                    <div className="admin-form-overlay">

                        <div className="admin-dog-form-card">

                            <div className="admin-form-header">
                                <div>
                                    <span className="admin-form-icon">
                                        🐶
                                    </span>

                                    <h2>
    {editingDog ? "Edit Dog" : "Add New Dog"}
</h2>

                                    <p>
    {editingDog
        ? "Update the details of this dog."
        : "Enter the details of the dog you want to add."}
</p>
                                </div>

                                <button
                                    className="admin-form-close"
                                    onClick={closeForm}
                                    type="button"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>

                                <div className="admin-form-grid">

                                    {/* Name */}
                                    <div className="admin-form-group">
                                        <label>
                                            Dog Name *
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Bruno"
                                            required
                                        />
                                    </div>

                                    {/* Breed */}
                                    <div className="admin-form-group">
                                        <label>
                                            Breed *
                                        </label>

                                        <input
                                            type="text"
                                            name="breed"
                                            value={formData.breed}
                                            onChange={handleChange}
                                            placeholder="e.g. Golden Retriever"
                                            required
                                        />
                                    </div>

                                    {/* Age */}
                                    <div className="admin-form-group">
                                        <label>
                                            Age *
                                        </label>

                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            placeholder="Age in years"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div className="admin-form-group">
                                        <label>
                                            Gender *
                                        </label>

                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Male">
                                                Male
                                            </option>

                                            <option value="Female">
                                                Female
                                            </option>
                                        </select>
                                    </div>

                                    {/* Type */}
                                    <div className="admin-form-group">
                                        <label>
                                            Listing Type *
                                        </label>

                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleTypeChange}
                                            required
                                        >
                                            <option value="Sale">
                                                For Sale
                                            </option>

                                            <option value="Adoption">
                                                Adoption
                                            </option>
                                        </select>
                                    </div>

                                    {/* Price */}
                                    <div className="admin-form-group">
                                        <label>
                                            Price
                                        </label>

                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder={
                                                formData.type === "Adoption"
                                                    ? "Free adoption"
                                                    : "e.g. 35000"
                                            }
                                            min="0"
                                            disabled={
                                                formData.type === "Adoption"
                                            }
                                        />

                                        {formData.type === "Adoption" && (
                                            <small>
                                                Adoption is free.
                                            </small>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <div className="admin-form-group">
                                        <label>
                                            Location *
                                        </label>

                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="e.g. Bangalore"
                                            required
                                        />
                                    </div>

                                    <div className="admin-form-group">
    <label>
        Availability
    </label>

    <select
        name="available"
        value={formData.available ? "true" : "false"}
        onChange={(e) =>
            setFormData((previous) => ({
                ...previous,
                available: e.target.value === "true"
            }))
        }
    >
        <option value="true">
            Available
        </option>

        <option value="false">
            Unavailable
        </option>
    </select>
</div>

                                    {/* Image */}
                                    <div className="admin-form-group">
                                        <label>
                                            Image Filename *
                                        </label>

                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            placeholder="e.g. golden-retriever.jpg"
                                            required
                                        />

                                        <small>
                                            Image must exist inside
                                            public/images.
                                        </small>
                                    </div>

                                </div>

                                {/* Description */}
                                <div className="admin-form-group admin-description-group">
                                    <label>
                                        Description *
                                    </label>

                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Write a short description about the dog..."
                                        rows="4"
                                        required
                                    />
                                </div>

                                {/* Preview */}
                                {formData.image && (
                                    <div className="admin-image-preview">
                                        <p>Image Preview</p>

                                        <img
                                            src={`/images/${formData.image}`}
                                            alt="Dog preview"
                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Form Buttons */}
                                <div className="admin-form-buttons">

                                    <button
                                        type="button"
                                        className="admin-cancel-form-btn"
                                        onClick={closeForm}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="admin-save-dog-btn"
                                        disabled={addingDog}
                                    >
                                        {addingDog
    ? editingDog
        ? "Updating..."
        : "Adding..."
    : editingDog
        ? "✏️ Update Dog"
        : "🐶 Add Dog"}
                                    </button>

                                </div>

                            </form>
                        </div>
                    </div>
                )}

                {/* Dogs */}
                {loading ? (
                    <div className="admin-loading">
                        🐾 Loading dogs...
                    </div>
                ) : dogs.length === 0 ? (
                    <div className="admin-empty">
                        <div>🐶</div>

                        <h2>No dogs found</h2>

                        <p>
                            Add a dog to make it available
                            on Pet House.
                        </p>
                    </div>
                ) : (
                    <div className="admin-dogs-grid">

                        {dogs.map((dog) => (
                            <div
                                className="admin-dog-card"
                                key={dog._id}
                            >

                                {/* Image */}
                                <div className="admin-dog-image">

                                    <img
                                        src={`/images/${dog.image}`}
                                        alt={dog.name}
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                    <span
                                        className={`admin-dog-type ${
                                            dog.type === "Adoption"
                                                ? "adoption"
                                                : "sale"
                                        }`}
                                    >
                                        {dog.type === "Adoption"
                                            ? "🏠 Adoption"
                                            : "💜 For Sale"}
                                    </span>

                                </div>

                                {/* Content */}
                                <div className="admin-dog-content">

                                    <div className="admin-dog-title-row">

                                        <h2>{dog.name}</h2>

                                        <span
                                            className={`admin-dog-status ${
                                                dog.available
                                                    ? "available"
                                                    : "unavailable"
                                            }`}
                                        >
                                            {dog.available
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>

                                    </div>

                                    <p className="admin-dog-breed">
                                        {dog.breed}
                                    </p>

                                    <div className="admin-dog-details">

                                        <span>
                                            🎂 {dog.age} year
                                            {dog.age !== 1 ? "s" : ""}
                                        </span>

                                        <span>
                                            {dog.gender === "Male"
                                                ? "♂️ Male"
                                                : "♀️ Female"}
                                        </span>

                                        <span>
                                            📍 {dog.location}
                                        </span>

                                    </div>

                                    <p className="admin-dog-description">
                                        {dog.description}
                                    </p>

                                    <div className="admin-dog-footer">

                                        <div className="admin-dog-price">
                                            {dog.type === "Adoption"
                                                ? "Free Adoption"
                                                : `₹${Number(
                                                      dog.price || 0
                                                  ).toLocaleString(
                                                      "en-IN"
                                                  )}`}
                                        </div>

                                        <div className="admin-dog-buttons">

                                            <Link
                                                to={`/dogs/${dog._id}`}
                                                className="admin-view-dog-btn"
                                            >
                                                View
                                            </Link>

                                            <button
    className="admin-edit-dog-btn"
    onClick={() => handleEditClick(dog)}
>
    Edit
</button>
                                            <button
    className="admin-delete-dog-btn"
    onClick={() => handleDeleteDog(dog._id)}
>
    Delete
</button>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}

export default AdminDogs;