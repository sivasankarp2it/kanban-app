import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import KanbanPage from './pages/KanbanPage'

export default function App() {
  const isLoggedIn = !!localStorage.getItem('token')

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/workspaces" /> : <Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workspaces" element={<KanbanPage />} />
      </Routes>
    </Router>
  )
}