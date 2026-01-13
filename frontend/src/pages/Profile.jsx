import { useState, useEffect } from "react";
import api from "../services/api";

export default function Profile({ setAuth }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
      setFormData({ name: res.data.name, email: res.data.email, password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    }
  };

  const handleUpdate = async () => {
    try {
      setError("");
      setSuccess("");
      
      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await api.put("/auth/profile", updateData);
      setUser(res.data.user);
      setFormData({ ...formData, password: "" });
      setIsEditing(false);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete("/auth/profile");
      localStorage.removeItem("token");
      if (setAuth) {
        setAuth(false);
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete profile");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    if (setAuth) {
      setAuth(false);
    } else {
      window.location.reload();
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Profile</h2>
      
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {!isEditing ? (
        <div style={styles.profileInfo}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <div style={styles.buttonGroup}>
            <button onClick={() => setIsEditing(true)} style={styles.button}>
              Edit Profile
            </button>
            <button onClick={logout} style={styles.button}>
              Logout
            </button>
            <button 
              onClick={handleDelete} 
              style={{...styles.button, ...styles.deleteButton}}
            >
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.editForm}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="New Password (leave blank to keep current)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={styles.input}
          />
          <div style={styles.buttonGroup}>
            <button onClick={handleUpdate} style={styles.button}>
              Save
            </button>
            <button 
              onClick={() => {
                setIsEditing(false);
                setError("");
                setSuccess("");
                fetchProfile();
              }} 
              style={styles.button}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginBottom: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  profileInfo: {
    marginTop: "10px",
  },
  editForm: {
    marginTop: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    flexWrap: "wrap",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  error: {
    padding: "10px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  success: {
    padding: "10px",
    backgroundColor: "#d4edda",
    color: "#155724",
    borderRadius: "4px",
    marginBottom: "10px",
  },
};
  