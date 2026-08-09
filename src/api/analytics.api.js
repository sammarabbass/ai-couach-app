import { api } from './client'

export const analyticsApi = {
  track: (event, meta = {}) => api.post('/analytics/track', { event, meta }),
  dau: (params) => api.get('/analytics/dau', { params }),
}
