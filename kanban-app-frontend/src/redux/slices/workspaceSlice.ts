import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit' 
import axios from '../../api/axios'

// Thunks
export const fetchWorkspaces = createAsyncThunk('workspace/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/workspaces')
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const createWorkspace = createAsyncThunk('workspace/create', async ({ name }: any, { rejectWithValue }) => {
  try {
    const res = await axios.post('/workspaces', { name })
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const updateWorkspace = createAsyncThunk('workspace/update', async ({ id, name }: any, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/workspaces/${id}`, { name })
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const deleteWorkspace = createAsyncThunk('workspace/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`/workspaces/${id}`)
    return id
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

// Slice
const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: { items: [] as any[], loading: false, error: null as any },
  reducers: {
    workspaceAdded: (state, action: PayloadAction<any>) => {
      state.items.push(action.payload)
    },
    workspaceUpdated: (state, action: PayloadAction<any>) => {
      const idx = state.items.findIndex((w: any) => w._id === action.payload._id)
      if (idx !== -1) state.items[idx] = action.payload
    },
    workspaceDeleted: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((w: any) => w._id !== action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action: any) => {
        state.loading = false
        state.items = action.payload || []
      })
      .addCase(createWorkspace.fulfilled, (state, action: any) => {
        state.items.push(action.payload)
      })
      .addCase(updateWorkspace.fulfilled, (state, action: any) => {
        const idx = state.items.findIndex((w: any) => w._id === action.payload._id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(deleteWorkspace.fulfilled, (state, action: any) => {
        state.items = state.items.filter((w: any) => w._id !== action.payload)
      })
  }
})

export const { workspaceAdded, workspaceUpdated, workspaceDeleted } = workspaceSlice.actions
export default workspaceSlice.reducer