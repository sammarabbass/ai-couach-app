import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RoleRoute({ role = 'admin' }) {
  const { user, isAdmin } = useAuth()
  const allowed = role === 'admin' ? isAdmin : true
  if (!allowed) return <Navigate to="/" replace />
  return <Outlet />
}
