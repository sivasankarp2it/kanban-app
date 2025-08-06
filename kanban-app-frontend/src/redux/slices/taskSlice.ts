// src/redux/slices/taskSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

export const fetchTasks = createAsyncThunk('task/fetch', async (workspaceId: string) => {
  const res = await axios.get(`/tasks/workspace/${workspaceId}`)
  return res.data
})

export const updateTask = createAsyncThunk('task/update', async ({ id, boardId, position }: any) => {
  const res = await axios.put(`/tasks/${id}`, { board: boardId, position })
  return res.data
})

// 🛠 Explicitly define initialState as any
const initialState: any = {
  items: [],
  loading: false,
}

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state: any) => {
        state.loading = true
      })
      .addCase(fetchTasks.fulfilled, (state: any, action: any) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(updateTask.fulfilled, (state: any, action: any) => {
        const index = state.items.findIndex((t: any) => t._id === action.payload._id)
        if (index !== -1) state.items[index] = action.payload
      })
  },
})

export default taskSlice.reducer