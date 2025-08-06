// ✅ Login Page: src/pages/Login.tsx

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../redux/slices/authSlice'
import { TextField, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState<any>({ email: '', password: '' })
  const dispatch = useDispatch<any>()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const result = await dispatch(loginUser(form))
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/workspaces')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Login</h2>
      <TextField fullWidth label="Email" className="mb-2" onChange={e => setForm({ ...form, email: e.target.value })} />
      <TextField fullWidth label="Password" type="password" className="mb-4" onChange={e => setForm({ ...form, password: e.target.value })} />
      <Button fullWidth variant="contained" onClick={handleSubmit}>Login</Button>
    </div>
  )
}