import { api } from './client'

export const logsApi = {
  system: (params) => api.get('/logs/system', { params }),
  aiUsage: (params) => api.get('/logs/ai-usage', { params }),
}
