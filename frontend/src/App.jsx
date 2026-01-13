import { useEffect, useState } from "react";
import api from "./services/api";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import KanbanBoard from "./components/KanbanBoard";
import TaskForm from "./components/TaskForm";

export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setAuth(false);
      } else {
        setError(err.response?.data?.message || "Failed to fetch tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth) {
      fetchTasks();
    }
  }, [auth]);

  if (!auth) {
    return (
      <div style={styles.app}>
        <h1 style={styles.title}>Task Management System</h1>
        <Register />
        <Login setAuth={setAuth} />
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>Task Management System</h1>
      {error && <div style={styles.error}>{error}</div>}
      <Profile setAuth={setAuth} />
      <TaskForm setTasks={setTasks} fetchTasks={fetchTasks} />
      {loading ? (
        <div style={styles.loading}>Loading tasks...</div>
      ) : (
        <KanbanBoard tasks={tasks} setTasks={setTasks} fetchTasks={fetchTasks} />
      )}
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
    fontSize: "clamp(24px, 5vw, 32px)",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    color: "#666",
  },
  error: {
    padding: "10px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "4px",
    marginBottom: "10px",
    maxWidth: "1200px",
    margin: "0 auto 10px",
  },
};
