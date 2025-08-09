import React from "react";

interface Workspace {
  id: string;
  name: string;
}

interface WorkspacesProps {
  workspaces: Workspace[];
  onSelect: (workspaceId: string) => void;
}

const Workspaces: React.FC<WorkspacesProps> = ({ workspaces, onSelect }) => {
  return (
    <div className="workspace-list">
      {workspaces.map((ws) => (
        <div
          key={ws.id}
          className="workspace-item"
          onClick={() => onSelect(ws.id)}
        >
          {ws.name}
        </div>
      ))}
    </div>
  );
};

export default Workspaces;