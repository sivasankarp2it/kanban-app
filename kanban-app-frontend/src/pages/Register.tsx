import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../redux/slices/authSlice'
import { TextField, Button } from '@mui/material'

export default function Register() {
  const [form, setForm] = useState<any>({ name: '', email: '', password: '' })
  const dispatch = useDispatch<any>()

  const handleSubmit = () => {
    dispatch(registerUser(form))
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Register</h2>
      <TextField fullWidth label="Name" className="mb-2" onChange={e => setForm({ ...form, name: e.target.value })} />
      <TextField fullWidth label="Email" className="mb-2" onChange={e => setForm({ ...form, email: e.target.value })} />
      <TextField fullWidth label="Password" type="password" className="mb-4" onChange={e => setForm({ ...form, password: e.target.value })} />
      <Button fullWidth variant="contained" onClick={handleSubmit}>Register</Button>
    </div>
  )
}