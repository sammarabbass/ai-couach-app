import { api } from './client'

export const usersApi = {
  list: (params) => api.get('/users', { params }),
  // ASSUMED optional query params: ?page=&limit=&search=

  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
}
