import { api } from './client'

export const imagesApi = {
  // Documented: multipart upload, field name "image"
  upload: (file, meta = {}) => {
    const form = new FormData()
    form.append('image', file)
    Object.entries(meta).forEach(([k, v]) => form.append(k, v))
    return api.post('/images', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Documented: admin queue filtered by status
  listByStatus: (status) => api.get('/images', { params: { status } }),

  // ASSUMED — "my progress photos" gallery for the logged-in user.
  listMine: () => api.get('/images', { params: { mine: true } }),
}
