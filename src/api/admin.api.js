import { api } from './client'

export const adminApi = {
  overview: () => api.get('/admin/dashboard/overview'),
  // Shape not documented — component reads defensively with fallbacks.
}
