import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import WorkspacePage from './pages/WorkspacePage'
import BoardViewPage from './pages/BoardViewPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workspaces" element={<WorkspacePage />} />
        <Route path="/workspace/:workspaceId" element={<BoardViewPage />} />
      </Routes>
    </Router>
  )
}