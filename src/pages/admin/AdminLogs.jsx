import { useEffect, useState } from 'react'
import { logsApi } from '../../api/logs.api'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const tabs = [
  { key: 'system', label: 'System logs', fetch: logsApi.system },
  { key: 'ai-usage', label: 'AI usage', fetch: logsApi.aiUsage },
]

export default function AdminLogs() {
  const [tab, setTab] = useState('system')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const active = tabs.find((t) => t.key === tab)
    active
      .fetch()
      .then((res) => setRows(res ?? []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [tab])

  const columns = rows[0] ? Object.keys(rows[0]).filter((k) => k !== '__v') : []

  return (
    <div className="p-8 max-w-5xl">
      <p className="label-eyebrow">Admin</p>
      <h1 className="font-display text-4xl mb-6">Logs</h1>

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide border ${
              tab === t.key ? 'border-ink bg-ink text-bg' : 'border-line text-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <EmptyState title="No log entries" />
      ) : (
        <Card className="p-0 overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead className="bg-bg text-muted uppercase tracking-wide">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="text-left px-4 py-3 whitespace-nowrap">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r._id || i} className="border-t border-line">
                  {columns.map((c) => (
                    <td key={c} className="px-4 py-2.5 whitespace-nowrap max-w-xs truncate">
                      {typeof r[c] === 'object' ? JSON.stringify(r[c]) : String(r[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
