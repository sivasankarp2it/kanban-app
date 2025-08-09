import React from "react";

interface Task {
  id: string;
  title: string;
}

interface TasksProps {
  boardId: string;
  tasks: Task[];
  onTaskMove: (taskId: string, sourceBoardId: string, targetBoardId: string) => void;
}

const Tasks: React.FC<TasksProps> = ({ boardId, tasks, onTaskMove }) => {
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceBoardId", boardId);
  };

  const handleDrop = (e: React.DragEvent) => {
    const taskId = e.dataTransfer.getData("taskId");
    const sourceBoardId = e.dataTransfer.getData("sourceBoardId");
    if (sourceBoardId !== boardId) {
      onTaskMove(taskId, sourceBoardId, boardId);
    }
  };

  return (
    <div
      className="task-list"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {tasks.map((task) => (
        <div
          key={task.id}
          className="task-item"
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
        >
          {task.title}
        </div>
      ))}
    </div>
  );
};

export default Tasks;