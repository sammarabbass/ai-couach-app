import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import AppShell from './components/layout/AppShell'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Progress from './pages/Progress'
import ProgressPhotos from './pages/ProgressPhotos'
import Profile from './pages/Profile'

import AdminOverview from './pages/admin/AdminOverview'
import AdminUsers from './pages/admin/AdminUsers'
import AdminDocuments from './pages/admin/AdminDocuments'
import AdminImageReview from './pages/admin/AdminImageReview'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminLogs from './pages/admin/AdminLogs'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell area="user" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/photos" element={<ProgressPhotos />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<RoleRoute role="admin" />}>
          <Route element={<AppShell area="admin" />}>
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/documents" element={<AdminDocuments />} />
            <Route path="/admin/images" element={<AdminImageReview />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/logs" element={<AdminLogs />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
