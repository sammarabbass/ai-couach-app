import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Could not create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <p className="label-eyebrow mb-2">AI Fitness Coach</p>
        <h1 className="font-display text-4xl mb-6">Create account</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            label="Name"
            name="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <p className="text-sm text-ember-700">{error}</p>}
          <Button type="submit" variant="accent" loading={loading} className="mt-2">
            Create account
          </Button>
        </form>
        <p className="text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-turf-700 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
