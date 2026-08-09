import { api } from './client'

export const progressApi = {
  // Documented:
  logEntry: (payload) => api.post('/progress', payload),
  // payload assumed: { type: 'weight' | 'workout' | ..., value, date, notes }

  summary: () => api.get('/progress/summary'),

  // ASSUMED — list of raw entries for the chart/table view.
  list: (params) => api.get('/progress', { params }),
}
