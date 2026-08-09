import { io } from 'socket.io-client'
import { getTokens } from '../api/client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket = null

// Connects with the JWT in the handshake, exactly as documented in the
// backend README: io(url, { auth: { token: accessToken } })
export function connectSocket() {
  if (socket?.connected) return socket
  const tokens = getTokens()
  socket = io(SOCKET_URL, {
    auth: { token: tokens?.accessToken },
    autoConnect: true,
  })
  return socket
}

export function getSocket() {
  return socket
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}
