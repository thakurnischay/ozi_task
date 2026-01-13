import { Droppable } from "@hello-pangea/dnd";

import TaskCard from "./TaskCard";

export default function Column({ status, statusLabel, tasks, fetchTasks }) {
  const statusColors = {
    "pending": "#ffc107",
    "in-progress": "#17a2b8",
    "completed": "#28a745"
  };

  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            ...styles.column,
            backgroundColor: snapshot.isDraggingOver ? "#e3f2fd" : "#f4f4f4",
            borderColor: statusColors[status],
          }}
        >
          <h3 style={{...styles.header, borderBottomColor: statusColors[status]}}>
            {statusLabel} ({tasks.length})
          </h3>
          <div style={styles.taskList}>
            {tasks.map((task, index) => (
              <TaskCard 
                key={task._id} 
                task={task} 
                index={index}
                fetchTasks={fetchTasks}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

const styles = {
  column: {
    width: "100%",
    maxWidth: "300px",
    minHeight: "400px",
    background: "#f4f4f4",
    padding: "15px",
    borderRadius: "8px",
    border: "2px solid",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    margin: "0 0 15px 0",
    paddingBottom: "10px",
    borderBottom: "2px solid",
    color: "#333",
    fontSize: "clamp(16px, 2vw, 18px)",
    fontWeight: "bold",
  },
  taskList: {
    flex: 1,
  },
};
