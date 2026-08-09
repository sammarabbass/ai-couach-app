import { useEffect, useState } from 'react'
import { usersApi } from '../../api/users.api'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const load = () => {
    setLoading(true)
    usersApi
      .list()
      .then((res) => setUsers(res?.users ?? res ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const toggleRole = async (u) => {
    const nextRole = u.role === 'admin' ? 'user' : 'admin'
    setUpdatingId(u._id || u.id)
    try {
      await usersApi.updateRole(u._id || u.id, nextRole)
      load()
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <p className="label-eyebrow">Admin</p>
      <h1 className="font-display text-4xl mb-8">Users</h1>

      {loading ? (
        <Spinner />
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg text-muted text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id || u.id} className="border-t border-line">
                  <td className="px-4 py-3">{u.name || '—'}</td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge tone={u.role === 'admin' ? 'ember' : 'turf'}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleRole(u)}
                      disabled={updatingId === (u._id || u.id)}
                      className="text-xs font-medium text-turf-700 hover:underline disabled:opacity-50"
                    >
                      {u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
