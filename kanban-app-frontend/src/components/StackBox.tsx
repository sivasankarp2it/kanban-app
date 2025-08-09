import { Avatar, IconButton, Tooltip, Box } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'

export default function StackBox() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state: any) => state.auth?.user)
  const username = user?.name || 'User'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')  // redirect to login page after logout
  }

  return (
    <Box sx={{display:"flex", justifyContent:"space-between", borderTop: '1px solid #ddd', pt:1}}>
      <Box sx={{display:"flex", alignItems:'center', gap: '1rem'}}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 16 }}>
          {username.charAt(0).toUpperCase()}
        </Avatar>
        {username}
      </Box>
      <Tooltip title="Logout" arrow>
        <IconButton
          size="small"
          onClick={handleLogout}
        >
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}