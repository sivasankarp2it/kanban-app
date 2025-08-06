import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

export const fetchBoards = createAsyncThunk('board/fetch', async (workspaceId: string) => {
  const res = await axios.get(`/boards/workspace/${workspaceId}`)
  return res.data
})

export const createBoard = createAsyncThunk('board/create', async ({ title, workspaceId }: any) => {
  const res = await axios.post('/boards', { name: title, workspaceId })
  return res.data
})

export const updateBoard = createAsyncThunk('board/update', async ({ boardId, title }: any) => {
  const res = await axios.put(`/boards/${boardId}`, { name: title })
  return res.data
})

export const deleteBoard = createAsyncThunk('board/delete', async (boardId: string) => {
  await axios.delete(`/boards/${boardId}`)
  return boardId
})

const boardSlice = createSlice({
  name: 'board',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state: any) => {
        state.loading = true
      })
      .addCase(fetchBoards.fulfilled, (state: any, action: any) => {
        state.loading = false
        state.items = action.payload
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
  },
})

export default boardSlice.reducer