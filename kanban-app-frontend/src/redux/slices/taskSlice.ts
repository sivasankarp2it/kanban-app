import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from '../../api/axios'

// Thunks
export const fetchTasks = createAsyncThunk('task/fetchByBoard', async (boardId: string, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/tasks/${boardId}`)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const createTask = createAsyncThunk('task/create', async ({ title, description, boardId, position }: any, { rejectWithValue }) => {
  try {
    const res = await axios.post(`/tasks`, { title, description, boardId, position })
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const updateTask = createAsyncThunk('task/update', async ({ id, boardId, position }: any, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/tasks/${id}`, { board: boardId, position })
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const deleteTask = createAsyncThunk('task/delete', async (taskId: string, { rejectWithValue }) => {
  try {
    await axios.delete(`/tasks/${taskId}`)
    return taskId
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

// Slice
const taskSlice = createSlice({
  name: 'task',
  initialState: { items: [] as any[], loading: false, error: null as any },
  reducers: {
    // socket reducers
    taskAdded: (state: any, action: PayloadAction<any>) => {
      state.items.push(action.payload)
    },
    taskUpdated: (state: any, action: PayloadAction<any>) => {
      const idx = state.items.findIndex((t: any) => t._id === action.payload._id)
      if (idx !== -1) state.items[idx] = action.payload
    },
    taskDeleted: (state: any, action: PayloadAction<string>) => {
      state.items = state.items.filter((t: any) => t._id !== action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state: any) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state: any, action: any) => {
        state.loading = false
        const newTasks = action.payload || []
        // remove tasks for that board then append new tasks
        if (newTasks.length === 0) {
          // nothing to add, but ensure unrelated tasks remain
          return
        }
        const boardId = newTasks[0].board
        state.items = [...state.items.filter((t: any) => t.board !== boardId), ...newTasks]
      })
      .addCase(fetchTasks.rejected, (state: any, action: any) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createTask.fulfilled, (state: any, action: any) => {
        state.items.push(action.payload)
      })
      .addCase(updateTask.fulfilled, (state: any, action: any) => {
        const index = state.items.findIndex((t: any) => t._id === action.payload._id)
        if (index !== -1) state.items[index] = action.payload
      })
      .addCase(deleteTask.fulfilled, (state: any, action: any) => {
        state.items = state.items.filter((t: any) => t._id !== action.payload)
      })
  }
})

export const { taskAdded, taskUpdated, taskDeleted } = taskSlice.actions
export default taskSlice.reducer