import { DragDropContext } from "@hello-pangea/dnd";

import Column from "./Column";
import api from "../services/api";

export default function KanbanBoard({ tasks, setTasks, fetchTasks }) {
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const task = tasks.find(t => t._id === draggableId);

    // Optimistic update
    if (task && task.status !== destination.droppableId) {
      setTasks(tasks.map(t =>
        t._id === draggableId
          ? { ...t, status: destination.droppableId }
          : t
      ));

      try {
        await api.put(`/tasks/${draggableId}`, {
          status: destination.droppableId,
        });
      } catch (err) {
        // Revert on error
        if (fetchTasks) {
          fetchTasks();
        } else {
          setTasks(tasks);
        }
        alert(err.response?.data?.message || "Failed to update task status");
      }
    }
  };

  const statusLabels = {
    "pending": "Pending",
    "in-progress": "In Progress",
    "completed": "Completed"
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={styles.board}>
        {["pending", "in-progress", "completed"].map(status => (
          <Column
            key={status}
            status={status}
            statusLabel={statusLabels[status]}
            tasks={tasks.filter(t => t.status === status)}
            fetchTasks={fetchTasks}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

const styles = {
  board: {
    display: "flex",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: "0 10px",
  },
};
