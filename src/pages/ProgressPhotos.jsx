import { useEffect, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { imagesApi } from '../api/images.api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

const statusTone = { approved: 'turf', pending: 'amber', rejected: 'ember' }
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '')


export default function ProgressPhotos() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const load = () => {
    setLoading(true)
    imagesApi
      .listMine()
      .then((res) => setImages(res ?? []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])
const onFile = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  setUploading(true)
  try {
    await imagesApi.upload(file)
    load()
  } catch (err) {
    console.error('Upload failed:', err)
  } finally {
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }
}

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="label-eyebrow">Visual log</p>
          <h1 className="font-display text-4xl">Photos</h1>
        </div>
        <Button variant="accent" onClick={() => fileRef.current?.click()} loading={uploading}>
          <Upload size={16} /> Upload
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>

      {loading ? (
        <Spinner />
      ) : images.length === 0 ? (
        <EmptyState
          title="No photos yet"
          hint="Progress photos go through moderation before they're marked approved."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card key={img._id || img.id} className="p-2">
              <div className="aspect-square bg-line/30 rounded-sm overflow-hidden">
{img.url && <img src={`${API_ORIGIN}${img.url}`} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-muted">
                  {img.createdAt ? new Date(img.createdAt).toLocaleDateString() : ''}
                </span>

            <Badge tone={statusTone[img.moderation?.status] || 'neutral'}>
  {img.moderation?.status || 'pending'}
</Badge>

              </div>
              {img.aiAnalysis?.status === 'done' && (
                <p className="text-xs text-muted mt-2 italic">{img.aiAnalysis.text}</p>
              )}
              {img.aiAnalysis?.status === 'pending' && (
                <p className="text-xs text-muted mt-2 italic">Analyzing...</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}