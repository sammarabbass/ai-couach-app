import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Camera, LineChart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { progressApi } from '../api/progress.api'
import Card, { CardEyebrow } from '../components/ui/Card'
import Button from '../components/ui/Button'
import StreakTicks from '../components/ui/StreakTicks'
import Spinner from '../components/ui/Spinner'

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    progressApi
      .summary()
      .then(setSummary)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Falls back to an empty 14-day streak if /progress/summary doesn't return
  // a `last14Days` array — adjust the key once the real shape is confirmed.
  const days = summary?.last14Days ?? Array(14).fill(false)

  return (
    <div className="p-8 max-w-5xl">
      <p className="label-eyebrow">Welcome back</p>
      <h1 className="font-display text-4xl mb-8">{user?.name || 'Athlete'}</h1>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <Card className="mb-6">
            <CardEyebrow>Training streak</CardEyebrow>
            <StreakTicks days={days} label="days logged" />
            {err && <p className="text-xs text-muted mt-3">Progress summary unavailable — {err}</p>}
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="flex flex-col gap-3">
              <MessageCircle className="text-turf-700" size={20} />
              <div>
                <p className="font-medium">Talk to your coach</p>
                <p className="text-sm text-muted">Ask about form, plans, or nutrition.</p>
              </div>
              <Button as={Link} to="/chat" variant="ghost" className="mt-auto w-fit">
                Open chat
              </Button>
            </Card>
            <Card className="flex flex-col gap-3">
              <LineChart className="text-turf-700" size={20} />
              <div>
                <p className="font-medium">Log progress</p>
                <p className="text-sm text-muted">Track weight, workouts, and notes.</p>
              </div>
              <Button as={Link} to="/progress" variant="ghost" className="mt-auto w-fit">
                Log entry
              </Button>
            </Card>
            <Card className="flex flex-col gap-3">
              <Camera className="text-turf-700" size={20} />
              <div>
                <p className="font-medium">Add a photo</p>
                <p className="text-sm text-muted">Progress photos are reviewed before posting.</p>
              </div>
              <Button as={Link} to="/photos" variant="ghost" className="mt-auto w-fit">
                Upload
              </Button>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
