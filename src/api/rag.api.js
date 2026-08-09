import { api } from './client'

export const ragApi = {
  // Documented:
  ingestDocument: (payload) => api.post('/rag/documents', payload),
  // payload assumed: { title, content } (JSON) — switch to FormData if the
  // real ingestion.service.js expects file uploads rather than raw text.

  query: (query) => api.post('/rag/query', { query }),

  // ASSUMED — for an admin document-library view.
  listDocuments: () => api.get('/rag/documents'),
}
