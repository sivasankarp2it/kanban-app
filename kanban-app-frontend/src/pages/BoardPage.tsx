import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoards } from '../redux/slices/boardSlice'
import { useParams } from 'react-router-dom'

export default function BoardPage() {
  const dispatch = useDispatch<any>()
  const { workspaceId } = useParams()
  const boards = useSelector((state: any) => state.board.items)
  const loading = useSelector((state: any) => state.board.loading)

  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchBoards(workspaceId))
    }
  }, [workspaceId])

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Boards</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {boards.map((board: any) => (
            <li key={board._id} className="bg-blue-100 p-2 mb-2 rounded">
              {board.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}