import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../redux/slices/authSlice'
import { TextField, Button, Typography, Stack, Paper, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const dispatch = useDispatch<any>()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!form.email || !form.password) return // simple client validation
    const result = await dispatch(loginUser(form))
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/workspaces')
    }
  }

  return (
    <Paper elevation={4} sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4, borderRadius: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Login
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <TextField
          label="Password"
          type="password"
          required
          fullWidth
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <Button variant="contained" size="large" fullWidth onClick={handleSubmit}>
          Login
        </Button>

        <Typography align="center" variant="body2">
          Don't have an account?{' '}
          <Link href="/register" underline="hover">
            Register here
          </Link>
        </Typography>
      </Stack>
    </Paper>
  )
};

export default Login;