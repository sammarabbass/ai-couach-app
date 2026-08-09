import { useEffect, useMemo, useRef, useState } from 'react'
import { Upload, CheckCircle2, Clock, XCircle, ImageOff } from 'lucide-react'
import { imagesApi } from '../api/images.api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

const statusTone = { approved: 'turf', pending: 'amber', rejected: 'ember' }
const STATUS_CONFIG = {
  approved: { icon: CheckCircle2, label: 'Approved' },
  pending: { icon: Clock, label: 'Pending' },
  rejected: { icon: XCircle, label: 'Rejected' },
}
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '')
const FILTERS = ['all', 'approved', 'pending', 'rejected']

export default function ProgressPhotos() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [filter, setFilter] = useState('all')
  const fileRef = useRef(null)
  const pollRef = useRef(null)

  const load = () =>
    imagesApi
      .listMine()
      .then((res) => setImages(res ?? []))
      .catch(() => setImages([]))

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  // Jab tak koi photo "pending" hai, har 4 sec mein background refresh —
  // result apne aap aa jayega, reload ki zaroorat nahi
  useEffect(() => {
    const hasPending = images.some((img) => img.aiAnalysis?.status === 'pending')
    if (hasPending && !pollRef.current) {
      pollRef.current = setInterval(load, 4000)
    }
    if (!hasPending && pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [images])

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      await imagesApi.upload(file)
      await load()
    } catch (err) {
      console.error('Upload failed:', err)
      setUploadError('Upload nahi ho saka. Dobara try karein.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const counts = useMemo(
    () => ({
      all: images.length,
      approved: images.filter((i) => i.moderation?.status === 'approved').length,
      pending: images.filter((i) => (i.moderation?.status || 'pending') === 'pending').length,
      rejected: images.filter((i) => i.moderation?.status === 'rejected').length,
    }),
    [images]
  )

  const filtered = filter === 'all' ? images : images.filter((i) => (i.moderation?.status || 'pending') === filter)

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="label-eyebrow">Visual log</p>
          <h1 className="font-display text-3xl sm:text-4xl">Photos</h1>
        </div>
        <Button
          type="button"
          variant="accent"
          onClick={() => fileRef.current?.click()}
          loading={uploading}
          className="w-full sm:w-fit"
        >
          <Upload size={16} /> Upload
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>

      {uploadError && <p className="text-sm text-red-600 mb-4">{uploadError}</p>}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {FILTERS.map((key) => {
          const active = filter === key
          const cfg = STATUS_CONFIG[key]
          const Icon = cfg?.icon
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`shrink-0 flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A36] ${
                active ? 'border-[#FF5A36] bg-[#FF5A36]/10 text-[#FF5A36]' : 'border-line bg-surface text-muted'
              }`}
            >
              {Icon && <Icon size={13} />}
              {key === 'all' ? 'All' : cfg.label}
              <span className="opacity-60">{counts[key]}</span>
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="py-10 flex justify-center">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={filter === 'all' ? 'No photos yet' : `No ${filter} photos`}
          hint="Progress photos go through moderation before they're marked approved."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((img) => {
            const status = img.moderation?.status || 'pending'
            const StatusIcon = STATUS_CONFIG[status]?.icon
            return (
              <Card key={img._id || img.id} className="p-2 group">
                <div className="aspect-square bg-line/30 rounded-sm overflow-hidden relative">
                  {img.url ? (
                    <img
                      src={`${API_ORIGIN}${img.url}`}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted">
                      <ImageOff size={20} />
                    </div>
                  )}
                </div>
                <div className="mt-2 flex justify-between items-center gap-2">
                  <span className="text-xs text-muted truncate">
                    {img.createdAt ? new Date(img.createdAt).toLocaleDateString() : ''}
                  </span>
                  <Badge tone={statusTone[status] || 'neutral'}>
                    <span className="flex items-center gap-1">
                      {StatusIcon && <StatusIcon size={11} />}
                      {status}
                    </span>
                  </Badge>
                </div>
                {img.aiAnalysis?.status === 'done' && (
                  <p className="text-xs text-muted mt-2 italic">{img.aiAnalysis.text}</p>
                )}
                {img.aiAnalysis?.status === 'pending' && (
                  <p className="text-xs text-muted mt-2 italic flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF5A36] animate-pulse" />
                    Analyzing...
                  </p>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}