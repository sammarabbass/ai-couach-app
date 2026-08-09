import { api } from './client'

export const chatbotApi = {
  // Documented in README:
  sendMessage: (chatId, content) =>
    api.post(`/chatbot/chats/${chatId}/messages`, { content }),

  // ASSUMED — not in the README table, inferred from the Chat/Message models
  // and the chatbot module having its own routes file. Adjust paths once
  // the real routes are confirmed.
  listChats: () => api.get('/chatbot/chats'),
  createChat: (title) => api.post('/chatbot/chats', { title }),
  getMessages: (chatId) => api.get(`/chatbot/chats/${chatId}/messages`),
}
