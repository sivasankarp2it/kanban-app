import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from '../../api/axios'

// Thunks
export const fetchBoards = createAsyncThunk('board/fetchByWorkspace', async (workspaceId: string, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/boards/workspace/${workspaceId}`)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const createBoard = createAsyncThunk('board/create', async ({ name, workspaceId }: any, { rejectWithValue }) => {
  try {
    const res = await axios.post('/boards', { name, workspaceId })
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const updateBoard = createAsyncThunk('board/update', async ({ boardId, name }: any, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/boards/${boardId}`, { name })
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const deleteBoard = createAsyncThunk('board/delete', async (boardId: string, { rejectWithValue }) => {
  try {
    await axios.delete(`/boards/${boardId}`)
    return boardId
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

// Slice
const boardSlice = createSlice({
  name: 'board',
  initialState: { items: [] as any[], loading: false, error: null as any },
  reducers: {
    // socket reducers
    boardAdded: (state: any, action: PayloadAction<any>) => {
      state.items.push(action.payload)
    },
    boardUpdated: (state: any, action: PayloadAction<any>) => {
      const idx = state.items.findIndex((b: any) => b._id === action.payload._id)
      if (idx !== -1) state.items[idx] = action.payload
    },
    boardDeleted: (state: any, action: PayloadAction<string>) => {
      state.items = state.items.filter((b: any) => b._id !== action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state: any) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBoards.fulfilled, (state: any, action: any) => {
        state.loading = false
        state.items = action.payload || []
      })
      .addCase(fetchBoards.rejected, (state: any, action: any) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createBoard.fulfilled, (state: any, action: any) => {
        state.items.push(action.payload)
      })
      .addCase(updateBoard.fulfilled, (state: any, action: any) => {
        const index = state.items.findIndex((b: any) => b._id === action.payload._id)
        if (index !== -1) state.items[index] = action.payload
      })
      .addCase(deleteBoard.fulfilled, (state: any, action: any) => {
        state.items = state.items.filter((b: any) => b._id !== action.payload)
      })
  }
})

export const { boardAdded, boardUpdated, boardDeleted } = boardSlice.actions
export default boardSlice.reducer