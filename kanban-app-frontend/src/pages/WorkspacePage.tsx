// ✅ Workspace Page: src/pages/WorkspacePage.tsx

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWorkspaces, createWorkspace, deleteWorkspace, updateWorkspace } from '../redux/slices/workspaceSlice'
import { TextField, Button, Card, CardContent, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import OpenInNewIcon from '@mui/icons-material/OpenInNew' 
import { Link } from 'react-router-dom'

export default function WorkspacePage() {
  const dispatch = useDispatch<any>()
  const workspaces = useSelector((state: any) => state.workspace.items)
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    dispatch(fetchWorkspaces())
  }, [])

  const handleCreate = () => {
    if (newName.trim()) {
      dispatch(createWorkspace({ name: newName }))
      setNewName('')
    }
  }

  const handleUpdate = () => {
    if (editId && editName.trim()) {
      dispatch(updateWorkspace({ id: editId, name: editName }))
      setEditId(null)
      setEditName('')
    }
  }

  const handleDelete = (id: string) => {
    dispatch(deleteWorkspace(id))
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4">Workspaces</h2>

      <div className="flex gap-2 mb-4">
        <TextField fullWidth label="New Workspace" value={newName} onChange={e => setNewName(e.target.value)} />
        <Button onClick={handleCreate} variant="contained">Add</Button>
      </div>

      {workspaces.map((ws: any) => (
        <Card key={ws._id} className="mb-2">
          <CardContent className="flex justify-between items-center">
            {editId === ws._id ? (
              <>
                <TextField
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  size="small"
                  className="mr-2"
                />
                <Button size="small" onClick={handleUpdate} variant="contained">Save</Button>
              </>
            ) : (
              <>
                <span>{ws.name}</span>
                <div>
                     <IconButton component={Link} to={`/workspace/${ws._id}`} title="Open Workspace">
                        <OpenInNewIcon />
                    </IconButton>
                  <IconButton onClick={() => {
                    setEditId(ws._id)
                    setEditName(ws.name)
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(ws._id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}