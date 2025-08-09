// src/pages/KanbanPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkspaces,
  createWorkspace,
  deleteWorkspace,
} from "../redux/slices/workspaceSlice";
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../redux/slices/boardSlice";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../redux/slices/taskSlice";

import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  IconButton,
  Typography,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function KanbanPage() {
  const dispatch = useDispatch<any>();

  // slices: items array in each slice
  const { items: workspaces } = useSelector((state: any) => state.workspace);
  const { items: boards } = useSelector((state: any) => state.board);
  const { items: tasks } = useSelector((state: any) => state.task);

  // local state
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [newWorkspace, setNewWorkspace] = useState("");
  const [newBoard, setNewBoard] = useState("");
  const [newTaskInputs, setNewTaskInputs] = useState<any>({});

  // local ordering of boards (keeps UI immediate feedback when reordering)
  const [boardOrder, setBoardOrder] = useState<string[]>([]);

  // initial load of workspaces
  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  // when workspace selected load its boards and tasks for each board
  useEffect(() => {
    if (!selectedWorkspace) {
      setBoardOrder([]);
      return;
    }

    let mounted = true;
    const load = async () => {
      try {
        const action: any = await dispatch(fetchBoards(selectedWorkspace));
        const boardsList: any[] = action.payload ?? [];
        if (!mounted) return;
        setBoardOrder(boardsList.map((b) => b._id));
        await Promise.all(boardsList.map((b) => dispatch(fetchTasks(b._id))));
      } catch (err) {
        // ignore
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [selectedWorkspace, dispatch]);

  const getTasksForBoard = (boardId: string) => tasks.filter((t: any) => t.board === boardId).sort((a:any,b:any)=> (a.position ?? 0) - (b.position ?? 0));

  const onCreateWorkspace = () => {
    if (!newWorkspace.trim()) return;
    dispatch(createWorkspace({ name: newWorkspace }));
    setNewWorkspace("");
  };

  const onDeleteWorkspace = (id: string) => {
    if (selectedWorkspace === id) {
      setSelectedWorkspace(null);
      setBoardOrder([]);
    }
    dispatch(deleteWorkspace(id));
  };

  const onCreateBoard = () => {
    if (!selectedWorkspace || !newBoard.trim()) return;
    dispatch(createBoard({ name: newBoard, workspaceId: selectedWorkspace }));
    setNewBoard("");
    // note: the server will emit boardCreated (if socket enabled) or fetchBoards will reload
  };

  const onDeleteBoard = (id: string) => {
    dispatch(deleteBoard(id));
    setBoardOrder((prev) => prev.filter((x) => x !== id));
  };

  const onCreateTask = (boardId: string) => {
    const title = (newTaskInputs[boardId] || "").trim();
    if (!title) return;
    const pos = getTasksForBoard(boardId).length;
    dispatch(createTask({ title, description: "", boardId, position: pos }));
    setNewTaskInputs((s: any) => ({ ...s, [boardId]: "" }));
  };

  const onDeleteTask = (id: string) => dispatch(deleteTask(id));

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;

    // 1) Board reorder (type === 'BOARD')
    if (type === "BOARD") {
      // reorder boardOrder locally
      const newOrder = Array.from(boardOrder);
      newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, draggableId);
      setBoardOrder(newOrder);

      // Optionally call updateBoard to "use update" thunk.
      // Your backend may not store board order; we call updateBoard as a placeholder
      // (sending unchanged name) so the existing update thunk is utilized.
      const board = boards.find((b: any) => b._id === draggableId);
      if (board) {
        try {
          await dispatch(updateBoard({ boardId: board._id, name: board.name }));
        } catch (err) {
          // ignore
        }
      }
      return;
    }

    // 2) Task drag (type === 'TASK' or default)
    const sourceBoardId = source.droppableId;
    const destBoardId = destination.droppableId;
    const sourceIndex = source.index;
    const destIndex = destination.index;

    // If same board and same index -> nothing
    if (sourceBoardId === destBoardId && sourceIndex === destIndex) return;

    // Get the task object (from tasks slice)
    const task = tasks.find((t: any) => t._id === draggableId);
    if (!task) return;

    // compute new position (we send destIndex as position)
    const payload: any = { id: draggableId, boardId: destBoardId, position: destIndex };

    // Optimistic local reorder of tasks in UI:
    // We won't mutate store directly here; instead we rely on fetchTasks or socket events to sync.
    // But for immediate feedback we could update local boardOrder or local UI state if implemented.
    // Dispatch updateTask to persist change
    try {
      await dispatch(updateTask(payload));
      // after successful update, fetch tasks for affected boards to refresh ordering
      // (fetch the dest and source boards to reflect positions)
      await Promise.all([dispatch(fetchTasks(destBoardId)), dispatch(fetchTasks(sourceBoardId))]);
    } catch (err) {
      // handle error if needed
    }
  };

  // Render
  return (
    <Box display="flex" height="100vh">
      {/* Left: workspaces */}
      <Box p={2} borderRight="1px solid #ddd" width={300} minWidth={260}>
        <Typography variant="h6">Workspaces</Typography>

        <Box display="flex" gap={1} mt={2}>
          <TextField
            size="small"
            placeholder="New workspace"
            value={newWorkspace}
            onChange={(e) => setNewWorkspace(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={onCreateWorkspace}>
            Add
          </Button>
        </Box>

        <List sx={{ mt: 2 }}>
          {workspaces.map((ws: any) => (
            <ListItem
              key={ws._id}
              sx={{
                cursor: "pointer",
                bgcolor: selectedWorkspace === ws._id ? "#e3f2fd" : "transparent",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onClick={() => setSelectedWorkspace(ws._id)}
            >
              <Box>{ws.name}</Box>
              <Box>
                <IconButton edge="end" onClick={(e) => { e.stopPropagation(); onDeleteWorkspace(ws._id); }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main area: boards as columns + tasks */}
      <Box flex={1} p={2} overflow="auto">
        {!selectedWorkspace ? (
          <Typography>Select a workspace to view its boards</Typography>
        ) : (
          <>
            {/* board create */}
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TextField
                size="small"
                placeholder="New board"
                value={newBoard}
                onChange={(e) => setNewBoard(e.target.value)}
              />
              <Button variant="contained" onClick={onCreateBoard}>
                Add Board
              </Button>
            </Box>

            <DragDropContext onDragEnd={onDragEnd}>
              {/* Boards container (horizontal droppable for boards) */}
              <Droppable droppableId="boards-droppable" direction="horizontal" type="BOARD">
                {(provided) => (
                  <Box
                    display="flex"
                    gap={2}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ minHeight: 400 }}
                  >
                    {/* iterate boards in local order if available, fallback to API order */}
                    {(boardOrder.length ? boardOrder.map(id => boards.find((b:any)=>b._id===id)) : boards)
                      .filter(Boolean)
                      .map((board: any, idx: number) => {
                        // tasks for this board
                        const boardTasks = getTasksForBoard(board._id);

                        return (
                          <Draggable draggableId={board._id} index={idx} key={board._id}>
                            {(draggableProvided) => (
                              <Paper
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.draggableProps}
                                sx={{ width: 300, padding: 1, background: "#f7f9fb" }}
                              >
                                {/* board header - use drag handle for board reorder */}
                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                  <Typography variant="subtitle1" {...draggableProvided.dragHandleProps} sx={{ cursor: "grab" }}>
                                    {board.name}
                                  </Typography>
                                  <Box>
                                    <IconButton size="small" onClick={() => onDeleteBoard(board._id)}>
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>

                                {/* Tasks droppable */}
                                <Droppable droppableId={board._id} type="TASK">
                                  {(providedTasks) => (
                                    <Box
                                      ref={providedTasks.innerRef}
                                      {...providedTasks.droppableProps}
                                      minHeight={200}
                                      sx={{ background: "#fff", padding: 1, borderRadius: 1 }}
                                    >
                                      {boardTasks.map((task: any, index: number) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                          {(taskProvided) => (
                                            <Card
                                              ref={taskProvided.innerRef}
                                              {...taskProvided.draggableProps}
                                              {...taskProvided.dragHandleProps}
                                              sx={{ mb: 1 }}
                                            >
                                              <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Box>
                                                  <Typography variant="body2">{task.title}</Typography>
                                                  {/* optional: show position */}
                                                  <Typography variant="caption" color="text.secondary">{`pos: ${task.position ?? 0}`}</Typography>
                                                </Box>
                                                <IconButton onClick={() => onDeleteTask(task._id)} size="small">
                                                  <DeleteIcon fontSize="small" />
                                                </IconButton>
                                              </CardContent>
                                            </Card>
                                          )}
                                        </Draggable>
                                      ))}

                                      {providedTasks.placeholder}

                                      {/* Add task inline */}
                                      <Box display="flex" gap={1} mt={1}>
                                        <TextField
                                          size="small"
                                          placeholder="New task"
                                          value={newTaskInputs[board._id] || ""}
                                          onChange={(e) => setNewTaskInputs((s: any) => ({ ...s, [board._id]: e.target.value }))}
                                          fullWidth
                                        />
                                        <Button size="small" variant="contained" onClick={() => onCreateTask(board._id)}>
                                          Add
                                        </Button>
                                      </Box>
                                    </Box>
                                  )}
                                </Droppable>
                              </Paper>
                            )}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </>
        )}
      </Box>
    </Box>
  );
}