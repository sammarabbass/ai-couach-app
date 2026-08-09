import { useEffect, useState } from 'react'
import { imagesApi } from '../../api/images.api'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const tabs = ['pending', 'rejected', 'approved']
const statusTone = { approved: 'turf', pending: 'amber', rejected: 'ember' }

export default function AdminImageReview() {
  const [status, setStatus] = useState('pending')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    imagesApi
      .listByStatus(status)
      .then((res) => setImages(res ?? []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false))
  }, [status])

  return (
    <div className="p-8 max-w-5xl">
      <p className="label-eyebrow">Admin</p>
      <h1 className="font-display text-4xl mb-6">Image review</h1>

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setStatus(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide border ${
              status === t ? 'border-ink bg-ink text-bg' : 'border-line text-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : images.length === 0 ? (
        <EmptyState title={`No ${status} images`} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card key={img._id || img.id} className="p-2">
              <div className="aspect-square bg-line/30 rounded-sm overflow-hidden">
                {img.url && <img src={img.url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-muted truncate">{img.owner?.email || img.userId}</span>
                <Badge tone={statusTone[img.status] || 'neutral'}>{img.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
