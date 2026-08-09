import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { analyticsApi } from '../../api/analytics.api'
import Card, { CardEyebrow } from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'

export default function AdminAnalytics() {
  const [dau, setDau] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsApi
      .dau()
      .then((res) => setDau(res ?? []))
      .catch(() => setDau([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8 max-w-4xl">
      <p className="label-eyebrow">Admin</p>
      <h1 className="font-display text-4xl mb-8">Analytics</h1>

      <Card>
        <CardEyebrow>Daily active users</CardEyebrow>
        {loading ? (
          <Spinner />
        ) : dau.length === 0 ? (
          <p className="text-sm text-muted py-10 text-center">No DAU data returned by /analytics/dau.</p>
        ) : (
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dau}>
                <CartesianGrid stroke="#DAD8CD" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5C6259' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5C6259' }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ borderRadius: 2, borderColor: '#DAD8CD', fontSize: 12 }} />
                <Bar dataKey="count" fill="#2B6E4F" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  )
}
