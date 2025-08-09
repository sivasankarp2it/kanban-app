import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

export const loginUser = createAsyncThunk('auth/login', async (data: any) => {
  const res = await axios.post('/auth/login', data)
  localStorage.setItem('token', res.data.token)
  return res.data
})

export const registerUser = createAsyncThunk('auth/register', async (data: any) => {
  const res = await axios.post('/auth/register', data)
  return res.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state: any) => {
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state: any, action: any) => {
        state.loading = false
        state.user = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer