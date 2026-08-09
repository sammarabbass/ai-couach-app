import { NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import {
  LayoutDashboard,
  MessageCircle,
  LineChart,
  Camera,
  User,
  Users,
  FileStack,
  ShieldCheck,
  ScrollText,
  BarChart3,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const userNav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/chat', label: 'Coach', icon: MessageCircle },
  { to: '/progress', label: 'Progress', icon: LineChart },
  { to: '/photos', label: 'Photos', icon: Camera },
  { to: '/profile', label: 'Profile', icon: User },
]

const adminNav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/documents', label: 'RAG Docs', icon: FileStack },
  { to: '/admin/images', label: 'Image Review', icon: ShieldCheck },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/logs', label: 'Logs', icon: ScrollText },
]

export default function AppShell({ area = 'user' }) {
  const { user, logout, isAdmin } = useAuth()
  const nav = area === 'admin' ? adminNav : userNav

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 border-r border-line bg-surface flex flex-col">
        <div className="px-5 py-6 border-b border-line">
          <p className="font-display text-2xl leading-none">AI Fitness</p>
          <p className="label-eyebrow mt-1">{area === 'admin' ? 'Admin console' : 'Coach'}</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors',
                  isActive ? 'bg-turf-50 text-turf-700' : 'text-muted hover:bg-bg hover:text-ink'
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        {isAdmin && (
          <div className="px-3 pb-2">
            <NavLink
              to={area === 'admin' ? '/' : '/admin'}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-muted hover:bg-bg hover:text-ink"
            >
              {area === 'admin' ? 'Back to app' : 'Admin console'}
            </NavLink>
          </div>
        )}
        <div className="px-5 py-4 border-t border-line flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || user?.email}</p>
            <p className="text-xs text-muted capitalize">{user?.role}</p>
          </div>
          <button onClick={logout} className="text-muted hover:text-ember-700" title="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
