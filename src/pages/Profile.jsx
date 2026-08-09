import { useAuth } from '../context/AuthContext'
import Card, { CardEyebrow } from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function Profile() {
  const { user } = useAuth()
  return (
    <div className="p-8 max-w-lg">
      <p className="label-eyebrow">Account</p>
      <h1 className="font-display text-4xl mb-8">Profile</h1>
      <Card className="flex flex-col gap-4">
        <div>
          <CardEyebrow>Name</CardEyebrow>
          <p className="text-sm">{user?.name || '—'}</p>
        </div>
        <div>
          <CardEyebrow>Email</CardEyebrow>
          <p className="text-sm">{user?.email}</p>
        </div>
        <div>
          <CardEyebrow>Role</CardEyebrow>
          <Badge tone={user?.role === 'admin' ? 'ember' : 'turf'}>{user?.role}</Badge>
        </div>
      </Card>
    </div>
  )
}
