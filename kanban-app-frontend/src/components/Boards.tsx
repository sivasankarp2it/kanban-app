import React from "react";
import Tasks from "./Tasks";

interface Board {
  id: string;
  name: string;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
}

interface BoardsProps {
  boards: Board[];
  onTaskMove: (taskId: string, sourceBoardId: string, targetBoardId: string) => void;
}

const Boards: React.FC<BoardsProps> = ({ boards, onTaskMove }) => {
  return (
    <div className="board-list">
      {boards.map((board) => (
        <div key={board.id} className="board">
          <h3>{board.name}</h3>
          <Tasks
            boardId={board.id}
            tasks={board.tasks}
            onTaskMove={onTaskMove}
          />
        </div>
      ))}
    </div>
  );
};

export default Boards;