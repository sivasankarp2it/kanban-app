// src/pages/BoardViewPage.tsx

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchBoards } from '../redux/slices/boardSlice'
import { fetchTasks, updateTask } from '../redux/slices/taskSlice' // You should create this
import { Box, Card, CardContent, Typography } from '@mui/material'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'


export default function BoardViewPage() {
  const { workspaceId } = useParams()
  const dispatch = useDispatch<any>()
  const boards = useSelector((state: any) => state.board.items)
  const tasks = useSelector((state: any) => state.task.items)

  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchBoards(workspaceId))
      dispatch(fetchTasks(workspaceId)) // You’ll implement this
    }
  }, [workspaceId])

  const getTasksForBoard = (boardId: string) => {
    return tasks.filter((t: any) => t.board === boardId)
  }

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result
    if (!destination) return

    const taskId = draggableId
    const newBoardId = destination.droppableId
    const newIndex = destination.index

    // You can pass the new board ID and position to update
    dispatch(updateTask({ id: taskId, boardId: newBoardId, position: newIndex }))
  }

  return (
    <Box className="p-4">
      <Typography variant="h4" className="mb-4">Boards</Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box className="flex gap-4 overflow-x-auto">
          {boards.map((board: any) => (
            <Droppable droppableId={board._id} key={board._id}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 rounded p-3 min-w-[250px] max-w-[250px]"
                >
                  <Typography variant="h6">{board.name}</Typography>

                  {getTasksForBoard(board._id).map((task: any, index: number) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mt-2"
                        >
                          <CardContent>
                            <Typography>{task.title}</Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  )
}