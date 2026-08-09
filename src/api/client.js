import axios from 'axios'

// ── ASSUMPTIONS ──────────────────────────────────────────────────────────
// The README documents endpoints and the auth flow but not the exact JSON
// envelope shape. Given utils/apiResponse.js + utils/apiError.js in the repo,
// this client assumes the common pattern:
//   success: { success: true, data: <payload>, message?: string }
//   error:   { success: false, message: string, errors?: [...] }
// If your actual envelope differs, this is the one place to change it —
// see `unwrap()` below.
// ─────────────────────────────────────────────────────────────────────────

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export const api = axios.create({ baseURL })

const TOKENS_KEY = 'afc_tokens' // { accessToken, refreshToken }

export function getTokens() {
  try {
    return JSON.parse(localStorage.getItem(TOKENS_KEY)) || null
  } catch {
    return null
  }
}

export function setTokens(tokens) {
  if (!tokens) {
    localStorage.removeItem(TOKENS_KEY)
    return
  }
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
}

function unwrap(response) {
  const body = response?.data
  // Tolerate either an { success, data } envelope or a bare payload.
  if (body && typeof body === 'object' && 'data' in body && 'success' in body) {
    return body.data
  }
  return body
}

api.interceptors.request.use((config) => {
  const tokens = getTokens()
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`
  }
  return config
})

let refreshPromise = null

api.interceptors.response.use(
  (response) => unwrap(response),
  async (error) => {
    const original = error.config
    const status = error.response?.status

    if (status === 401 && !original._retry && original.url !== '/auth/refresh') {
      original._retry = true
      const tokens = getTokens()
      if (!tokens?.refreshToken) {
        setTokens(null)
        return Promise.reject(normalizeError(error))
      }

      try {
        // De-dupe concurrent refreshes from multiple in-flight requests.
        refreshPromise =
          refreshPromise ||
          axios
            .post(`${baseURL}/auth/refresh`, { refreshToken: tokens.refreshToken })
            .then((res) => unwrap(res))
        const fresh = await refreshPromise
        refreshPromise = null
        setTokens(fresh)
        original.headers.Authorization = `Bearer ${fresh.accessToken}`
        return api.request(original)
      } catch (refreshErr) {
        refreshPromise = null
        setTokens(null)
        window.location.assign('/login')
        return Promise.reject(normalizeError(refreshErr))
      }
    }

    return Promise.reject(normalizeError(error))
  }
)

function normalizeError(error) {
  const message =
    error.response?.data?.message || error.message || 'Something went wrong'
  const errors = error.response?.data?.errors
  const status = error.response?.status
  return { message, errors, status }
}
