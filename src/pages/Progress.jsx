import { useEffect, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Scale, Dumbbell, TrendingUp, TrendingDown, CalendarDays } from 'lucide-react'
import { progressApi } from '../api/progress.api'
import Card, { CardEyebrow } from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

const TYPE_CONFIG = {
  weight: { label: 'Weight', unit: 'kg', placeholder: 'e.g. 72.5', icon: Scale },
  workout: { label: 'Workout', unit: '%', placeholder: 'e.g. 80', icon: Dumbbell },
}

export default function Progress() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ type: 'weight', value: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [justSaved, setJustSaved] = useState(false)

  const load = () => {
    setLoading(true)
    progressApi
      .list()
      .then((res) => setEntries(res ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await progressApi.logEntry({
        itemType: form.type,
        itemId: `${form.type}-${Date.now()}`,
        percent: Number(form.value),
        metadata: { notes: form.notes, date: new Date().toISOString() },
      })
      setForm({ type: form.type, value: '', notes: '' })
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2500)
      load()
    } catch (err) {
      setError('Entry save nahi ho saki. Dobara try karein.')
    } finally {
      setSaving(false)
    }
  }

  const chartData = useMemo(
    () =>
      entries
        .filter((e) => e.itemType === 'weight')
        .map((e) => ({
          date: new Date(e.metadata?.date || e.updatedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          }),
          value: e.percent,
        })),
    [entries]
  )

  const latest = chartData[chartData.length - 1]
  const prev = chartData[chartData.length - 2]
  const delta = latest && prev ? +(latest.value - prev.value).toFixed(1) : null

  const recentEntries = useMemo(
    () =>
      [...entries]
        .sort((a, b) => new Date(b.metadata?.date || b.updatedAt) - new Date(a.metadata?.date || a.updatedAt))
        .slice(0, 5),
    [entries]
  )

  const activeConfig = TYPE_CONFIG[form.type]

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      <p className="label-eyebrow">Track</p>
      <h1 className="font-display text-3xl sm:text-4xl mb-6 sm:mb-8">Progress</h1>

      {/* Quick stats — most important numbers, upfront */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
        <Card className="p-3 sm:p-4 text-center">
          <p className="text-[11px] sm:text-xs text-muted uppercase tracking-wide">Latest</p>
          <p className="font-display text-xl sm:text-2xl mt-1">{latest ? latest.value : '—'}</p>
          <p className="text-[11px] sm:text-xs text-muted">kg</p>
        </Card>
        <Card className="p-3 sm:p-4 text-center">
          <p className="text-[11px] sm:text-xs text-muted uppercase tracking-wide">Change</p>
          <p className="font-display text-xl sm:text-2xl mt-1 flex items-center justify-center gap-1">
            {delta === null ? (
              '—'
            ) : (
              <>
                {delta > 0 && <TrendingUp size={16} className="text-muted" />}
                {delta < 0 && <TrendingDown size={16} className="text-muted" />}
                {Math.abs(delta)}
              </>
            )}
          </p>
          <p className="text-[11px] sm:text-xs text-muted">kg vs last</p>
        </Card>
        <Card className="p-3 sm:p-4 text-center">
          <p className="text-[11px] sm:text-xs text-muted uppercase tracking-wide">Logged</p>
          <p className="font-display text-xl sm:text-2xl mt-1">{entries.length}</p>
          <p className="text-[11px] sm:text-xs text-muted">entries</p>
        </Card>
      </div>

      <Card className="mb-6">
        <CardEyebrow>Weight trend</CardEyebrow>
        {loading ? (
          <div className="h-48 sm:h-56 flex items-center justify-center">
            <Spinner />
          </div>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted py-10 text-center">Log a weight entry to see your trend.</p>
        ) : (
          <div className="h-48 sm:h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#DAD8CD" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5C6259' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5C6259' }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ borderRadius: 2, borderColor: '#DAD8CD', fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke="#FF5A36" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card className="mb-6">
        <CardEyebrow>Log an entry</CardEyebrow>
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted uppercase tracking-wide">Type</label>
            <div className="flex gap-2">
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon
                const active = form.type === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm({ ...form, type: key, value: '' })}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-sm border px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A36] ${
                      active ? 'border-[#FF5A36] bg-[#FF5A36]/10 text-[#FF5A36]' : 'border-line bg-surface text-muted'
                    }`}
                  >
                    <Icon size={15} />
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>
          <Input
            label={`${activeConfig.label} (${activeConfig.unit})`}
            type="number"
            step="0.1"
            required
            placeholder={activeConfig.placeholder}
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />
          <Input
            label="Notes"
            placeholder="Optional"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          {error && <p className="sm:col-span-2 md:col-span-3 text-sm text-red-600">{error}</p>}
          {justSaved && !error && (
            <p className="sm:col-span-2 md:col-span-3 text-sm text-emerald-600">Entry saved.</p>
          )}

          <Button type="submit" variant="accent" loading={saving} className="md:col-span-3 w-full sm:w-fit">
            Save entry
          </Button>
        </form>
      </Card>

      {recentEntries.length > 0 && (
        <Card>
          <CardEyebrow>Recent entries</CardEyebrow>
          <div className="mt-2 divide-y divide-line">
            {recentEntries.map((e) => {
              const Icon = TYPE_CONFIG[e.itemType]?.icon
              return (
                <div key={e._id || e.itemId} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 flex items-center gap-1 rounded-sm bg-surface border border-line px-2 py-0.5 text-xs uppercase tracking-wide text-muted">
                      {Icon && <Icon size={11} />}
                      {e.itemType}
                    </span>
                    <span className="truncate text-muted">{e.metadata?.notes || '—'}</span>
                  </div>
                  <div className="shrink-0 flex items-baseline gap-2">
                    <span className="font-medium">
                      {e.percent}
                      {e.itemType === 'weight' ? ' kg' : '%'}
                    </span>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <CalendarDays size={11} />
                      {new Date(e.metadata?.date || e.updatedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}