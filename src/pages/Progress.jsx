import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { progressApi } from '../api/progress.api'
import Card, { CardEyebrow } from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function Progress() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ type: 'weight', value: '', notes: '' })
  const [saving, setSaving] = useState(false)

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
  setSaving(true)
  try {
    await progressApi.logEntry({
      itemType: form.type,
      itemId: `${form.type}-${Date.now()}`,   // har entry unique rahegi
      percent: Number(form.value),
      metadata: { notes: form.notes, date: new Date().toISOString() },
    })
    setForm({ type: 'weight', value: '', notes: '' })
    load()
  } finally {
    setSaving(false)
  }
}

const chartData = entries
  .filter((e) => e.itemType === 'weight')
  .map((e) => ({
    date: new Date(e.metadata?.date || e.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    value: e.percent,
  }))
  return (
    <div className="p-8 max-w-4xl">
      <p className="label-eyebrow">Track</p>
      <h1 className="font-display text-4xl mb-8">Progress</h1>

      <Card className="mb-6">
        <CardEyebrow>Weight trend</CardEyebrow>
        {loading ? (
          <Spinner />
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted py-10 text-center">Log a weight entry to see your trend.</p>
        ) : (
          <div className="h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#DAD8CD" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5C6259' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5C6259' }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ borderRadius: 2, borderColor: '#DAD8CD', fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke="#FF5A36" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card>
        <CardEyebrow>Log an entry</CardEyebrow>
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted uppercase tracking-wide">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="rounded-sm border border-line bg-surface px-3 py-2.5 text-sm"
            >
              <option value="weight">Weight</option>
              <option value="workout">Workout</option>
            </select>
          </div>
          <Input
            label="Value"
            type="number"
            step="0.1"
            required
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />
          <Input
            label="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <Button type="submit" variant="accent" loading={saving} className="sm:col-span-3 w-fit">
            Save entry
          </Button>
        </form>
      </Card>
    </div>
  )
}
