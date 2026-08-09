import { api } from './client'

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  // payload assumed: { name, email, password }

  login: (payload) => api.post('/auth/login', payload),
  // payload assumed: { email, password }

  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),

  me: () => api.get('/auth/me'),
}
