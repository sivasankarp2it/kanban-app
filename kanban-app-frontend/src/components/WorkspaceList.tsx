import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../api/axios'

export const fetchWorkspaces = createAsyncThunk('workspace/fetch', async () => {
  const res = await axios.get('/workspaces')
  return res.data
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
  },
})

export default workspaceSlice.reducer