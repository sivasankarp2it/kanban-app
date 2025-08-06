import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../api/axios'

export const fetchWorkspaces = createAsyncThunk('workspace/fetch', async () => {
  const res = await axios.get('/workspaces')
  return res.data
})

export const createWorkspace = createAsyncThunk('workspace/create', async (data: any) => {
  const res = await axios.post('/workspaces', data)
  return res.data
})

export const updateWorkspace = createAsyncThunk('workspace/update', async ({ id, name }: any) => {
  const res = await axios.put(`/workspaces/${id}`, { name })
  return res.data
})

export const deleteWorkspace = createAsyncThunk('workspace/delete', async (id: string) => {
  await axios.delete(`/workspaces/${id}`)
  return id
})

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state: any) => {
        state.loading = true
      })
      .addCase(fetchWorkspaces.fulfilled, (state: any, action: any) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(createWorkspace.fulfilled, (state: any, action: any) => {
        state.items.push(action.payload)
      })
      .addCase(updateWorkspace.fulfilled, (state: any, action: any) => {
        const index = state.items.findIndex((w: any) => w._id === action.payload._id)
        if (index !== -1) state.items[index] = action.payload
      })
      .addCase(deleteWorkspace.fulfilled, (state: any, action: any) => {
        state.items = state.items.filter((w: any) => w._id !== action.payload)
      })
  },
})
export default workspaceSlice.reducer

// export default workspaceSlice.reducer
// export { createWorkspace, updateWorkspace, deleteWorkspace }