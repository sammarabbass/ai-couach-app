import { useEffect, useState } from 'react'
import { adminApi } from '../../api/admin.api'
import Card, { CardEyebrow } from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'

// The overview payload shape isn't documented, so this renders whatever
// numeric top-level fields come back as stat tiles, plus a raw fallback.
export default function AdminOverview() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    adminApi
      .overview()
      .then(setData)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false))
  }, [])

  const stats = data ? Object.entries(data).filter(([, v]) => typeof v === 'number') : []

  return (
    <div className="p-8 max-w-5xl">
      <p className="label-eyebrow">Admin</p>
      <h1 className="font-display text-4xl mb-8">Overview</h1>

      {loading ? (
        <Spinner />
      ) : err ? (
        <p className="text-sm text-ember-700">{err}</p>
      ) : stats.length === 0 ? (
        <p className="text-sm text-muted">No summary fields returned by /admin/dashboard/overview.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(([key, value]) => (
            <Card key={key}>
              <CardEyebrow>{key.replace(/([A-Z])/g, ' $1')}</CardEyebrow>
              <p className="font-display text-3xl">{value}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
