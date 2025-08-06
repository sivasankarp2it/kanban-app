import { configureStore } from '@reduxjs/toolkit'
import workspaceReducer from './slices/workspaceSlice'
import boardReducer from './slices/boardSlice'
import taskReducer from './slices/taskSlice'

const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    board: boardReducer,
    task: taskReducer,
  },
})

export default store