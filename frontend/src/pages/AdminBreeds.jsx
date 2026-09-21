import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
    name: "",
    emoji: "🐶",
    description: ""
};

function AdminBreeds() {
    const [breeds, setBreeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(emptyForm);

    const [editingBreed, setEditingBreed] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadBreeds();
    }, []);

    const loadBreeds = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/breeds");

            setBreeds(
                response.data?.breeds ||
                response.data ||
                []
            );
        } catch (error) {
            console.error("Load breeds error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load breeds."
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

            if (editingBreed) {
                response = await api.put(
                    `/breeds/${editingBreed._id}`,
                    formData
                );
            } else {
                response = await api.post(
                    "/breeds",
                    formData
                );
            }

            if (response.data.success) {
                alert(
                    editingBreed
                        ? "Breed updated successfully! 🐶🎉"
                        : "Breed added successfully! 🐶🎉"
                );

                setFormData(emptyForm);
                setEditingBreed(null);
                setShowForm(false);

                loadBreeds();
            }
        } catch (error) {
            console.error(
                editingBreed
                    ? "Update breed error:"
                    : "Add breed error:",
                error
            );

            setError(
                error.response?.data?.message ||
                (
                    editingBreed
                        ? "Unable to update breed."
                        : "Unable to add breed."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEditClick = (breed) => {
        setEditingBreed(breed);

        setFormData({
            name: breed.name || "",
            emoji: breed.emoji || "🐶",
            description: breed.description || ""
        });

        setShowForm(true);
    };

    const handleDeleteBreed = async (breedId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this breed?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await api.delete(
                `/breeds/${breedId}`
            );

            if (response.data.success) {
                alert("Breed deleted successfully! 🗑️");

                loadBreeds();
            }
        } catch (error) {
            console.error(
                "Delete breed error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete breed."
            );
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingBreed(null);
        setFormData(emptyForm);
        setError("");
    };

    return (
        <div className="admin-breeds-page">

            <div className="admin-breeds-header">

                <div>
                    <p className="admin-breeds-label">
                        BREED MANAGEMENT
                    </p>

                    <h1>
                        Manage Dog Breeds 🐶
                    </h1>

                    <p>
                        Add and manage dog breed information
                        for your Pet House users.
                    </p>
                </div>

                <button
                    className="admin-add-breed-btn"
                    onClick={() => {
                        setEditingBreed(null);
                        setFormData(emptyForm);
                        setShowForm(true);
                    }}
                >
                    + Add Breed
                </button>

            </div>

            {error && (
                <div className="admin-breeds-error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="admin-breeds-loading">
                    Loading breeds...
                </div>
            ) : breeds.length === 0 ? (
                <div className="admin-breeds-empty">

                    <div className="admin-breeds-empty-icon">
                        🐶
                    </div>

                    <h2>
                        No Breeds Found
                    </h2>

                    <p>
                        Start by adding your first dog breed.
                    </p>

                    <button
                        className="admin-add-breed-btn"
                        onClick={() => {
                            setFormData(emptyForm);
                            setEditingBreed(null);
                            setShowForm(true);
                        }}
                    >
                        + Add Breed
                    </button>

                </div>
            ) : (
                <div className="admin-breeds-grid">

                    {breeds.map((breed) => (
                        <div
                            className="admin-breed-card"
                            key={breed._id}
                        >

                            <div className="admin-breed-image">
                                {breed.emoji || "🐶"}
                            </div>

                            <div className="admin-breed-content">

                                <h2>
                                    {breed.name}
                                </h2>

                                <p>
                                    {breed.description ||
                                        "No description available."}
                                </p>

                                <div className="admin-breed-actions">

                                    <button
                                        className="admin-edit-breed-btn"
                                        onClick={() =>
                                            handleEditClick(breed)
                                        }
                                    >
                                        ✏️ Edit
                                    </button>

                                    <button
                                        className="admin-delete-breed-btn"
                                        onClick={() =>
                                            handleDeleteBreed(
                                                breed._id
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
                <div className="admin-breed-form-overlay">

                    <div className="admin-breed-form-card">

                        <div className="admin-breed-form-header">

                            <div>
                                <p>
                                    {editingBreed
                                        ? "EDIT BREED"
                                        : "NEW BREED"}
                                </p>

                                <h2>
                                    {editingBreed
                                        ? "Edit Breed ✏️"
                                        : "Add New Breed 🐶"}
                                </h2>
                            </div>

                            <button
                                className="admin-breed-form-close"
                                onClick={closeForm}
                            >
                                ✕
                            </button>

                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="admin-breed-form-grid">

                                <div className="admin-breed-form-group">

                                    <label>
                                        Breed Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Golden Retriever"
                                        required
                                    />

                                </div>

                                <div className="admin-breed-form-group">

                                    <label>
                                        Emoji
                                    </label>

                                    <input
                                        type="text"
                                        name="emoji"
                                        value={formData.emoji}
                                        onChange={handleChange}
                                        placeholder="🐶"
                                    />

                                    <small>
                                        Example: 🐶 🐕 🐕‍🦺
                                    </small>

                                </div>

                                <div className="admin-breed-form-group admin-breed-form-full">

                                    <label>
                                        Description *
                                    </label>

                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter breed description"
                                        rows="4"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="admin-breed-form-actions">

                                <button
                                    type="button"
                                    className="admin-cancel-breed-btn"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-save-breed-btn"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingBreed
                                        ? "Update Breed"
                                        : "Add Breed"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminBreeds;