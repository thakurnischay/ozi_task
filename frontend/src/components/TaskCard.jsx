import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import api from "../services/api";

export default function TaskCard({ task, index, fetchTasks }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTask = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${task._id}`);
      if (fetchTasks) {
        fetchTasks();
      } else {
        window.location.reload();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete task");
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...styles.card,
            backgroundColor: snapshot.isDragging ? "#e3f2fd" : "#fff",
            boxShadow: snapshot.isDragging 
              ? "0 4px 8px rgba(0,0,0,0.2)" 
              : "0 2px 4px rgba(0,0,0,0.1)",
            ...provided.draggableProps.style,
          }}
        >
          <h4 style={styles.title}>{task.title}</h4>
          {task.description && (
            <p style={styles.description}>{task.description}</p>
          )}
          <div style={styles.footer}>
            <small style={{
              ...styles.dueDate,
              color: isOverdue(task.due_date) ? "#dc3545" : "#666"
            }}>
              {formatDate(task.due_date)}
            </small>
            <button 
              onClick={deleteTask}
              disabled={isDeleting}
              style={styles.deleteButton}
            >
              {isDeleting ? "..." : "×"}
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

const styles = {
  card: {
    padding: "15px",
    margin: "10px 0",
    background: "#fff",
    borderRadius: "6px",
    border: "1px solid #ddd",
    cursor: "grab",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    margin: "0 0 10px 0",
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.4",
    maxHeight: "60px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  dueDate: {
    fontSize: "12px",
    color: "#666",
  },
  deleteButton: {
    background: "transparent",
    border: "none",
    fontSize: "20px",
    color: "#dc3545",
    cursor: "pointer",
    padding: "0 5px",
    lineHeight: "1",
  },
};
