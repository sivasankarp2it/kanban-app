import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../redux/slices/authSlice'
import { TextField, Button, Typography, Stack, Paper, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const dispatch = useDispatch<any>()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return // simple client validation
    const result = await dispatch(registerUser(form))
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/login')
    }
  }

  return (
    <Paper elevation={4} sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4, borderRadius: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Register
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Name"
          required
          fullWidth
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

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
          Register
        </Button>

        <Typography align="center" variant="body2">
          Already have an account?{' '}
          <Link href="/login" underline="hover">
            Login here
          </Link>
        </Typography>
      </Stack>
    </Paper>
  )
}