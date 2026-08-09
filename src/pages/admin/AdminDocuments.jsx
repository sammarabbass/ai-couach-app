import { useEffect, useState } from 'react'
import { ragApi } from '../../api/rag.api'
import Card, { CardEyebrow } from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function AdminDocuments() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', content: '' })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    ragApi
      .listDocuments()
      .then((res) => setDocs(res ?? []))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await ragApi.ingestDocument(form)
      setForm({ title: '', content: '' })
      load()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <p className="label-eyebrow">Admin</p>
      <h1 className="font-display text-4xl mb-8">RAG documents</h1>

      <Card className="mb-6">
        <CardEyebrow>Ingest a new document</CardEyebrow>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
          <Input
            label="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted uppercase tracking-wide">Content</label>
            <textarea
              required
              rows={6}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="rounded-sm border border-line bg-surface px-3 py-2.5 text-sm resize-y"
            />
          </div>
          <Button type="submit" variant="accent" loading={saving} className="w-fit">
            Ingest document
          </Button>
        </form>
      </Card>

      {loading ? (
        <Spinner />
      ) : docs.length === 0 ? (
        <EmptyState title="No documents yet" hint="Ingested documents feed the coach's RAG retrieval." />
      ) : (
        <div className="flex flex-col gap-2">
          {docs.map((d) => (
            <Card key={d._id || d.id} className="flex items-center justify-between">
              <span className="text-sm font-medium">{d.title}</span>
              <span className="text-xs text-muted font-mono">
                {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : ''}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
