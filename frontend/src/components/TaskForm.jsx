import { useState } from "react";
import api from "../services/api";

export default function TaskForm({ setTasks, fetchTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createTask = async (e) => {
    e?.preventDefault();
    setError("");
    
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/tasks", {
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate || null,
        status: "pending",
      });

      // Add new task to state immediately
      setTasks((prev) => [...prev, res.data]);

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Create Task</h3>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={createTask}>
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
          rows={3}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={styles.input}
        />
        <button 
          type="submit"
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    maxWidth: "1200px",
    margin: "0 auto 20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontFamily: "inherit",
    resize: "vertical",
  },
  button: {
    padding: "10px 20px",
    marginTop: "10px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#28a745",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  },
  error: {
    padding: "10px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "4px",
    marginBottom: "10px",
  },
};
