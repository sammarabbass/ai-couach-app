import ReactMarkdown from 'react-markdown'
import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { chatbotApi } from '../api/chatbot.api'
import { connectSocket } from '../lib/socket'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'

export default function Chat() {
  const [chatId, setChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const socketRef = useRef(null)

  useEffect(() => {
    async function init() {
      try {
        // ASSUMED endpoints — see api/chatbot.api.js
        const chats = await chatbotApi.listChats()
        let active = chats?.[0]
        if (!active) active = await chatbotApi.createChat('Coach chat')
        setChatId(active._id || active.id)
        const history = await chatbotApi.getMessages(active._id || active.id)
        setMessages(history ?? [])
      } catch {
        // Backend may not expose chat listing yet — start a local session
        // and rely purely on the documented send/receive socket events.
        setChatId('local')
      } finally {
        setLoading(false)
      }
    }
    init()

    const socket = connectSocket()
    socketRef.current = socket
    socket.on('chat:message', (msg) => {
      setMessages((prev) => [...prev, msg])
      setSending(false)
    })
    return () => {
      socket.off('chat:message')
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (e) => {
    e.preventDefault()
    if (!draft.trim() || !chatId) return
    const content = draft.trim()
    setMessages((prev) => [...prev, { role: 'user', content, _local: true }])
    setDraft('')
    setSending(true)

    // Documented contract: emit 'chat:send' with an ack callback, and the
    // assistant's reply arrives separately via the 'chat:message' event.
    socketRef.current?.emit('chat:send', { chatId, content }, (ack) => {
      if (ack?.error) setSending(false)
    })
  }

  if (loading) return <Spinner className="min-h-screen" />

  return (
    <div className="flex flex-col h-screen">
      <div className="px-8 py-5 border-b border-line">
        <p className="label-eyebrow">Coach</p>
        <h1 className="font-display text-3xl">Chat</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted">
            Ask your coach about workouts, recovery, or your plan.
          </p>
        )}

{messages.map((m, i) => (
  <div
    key={i}
    className={`max-w-lg rounded-sm px-4 py-2.5 text-sm ${
      m.role === 'user'
        ? 'self-end bg-turf-700 text-white'
        : 'self-start bg-surface border border-line prose prose-sm'
    }`}
  >
    {m.role === 'user' ? m.content : <ReactMarkdown>{m.content}</ReactMarkdown>}
  </div>
))}

        {sending && (
          <div className="self-start text-xs text-muted font-mono">coach is typing…</div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="border-t border-line px-8 py-4 flex gap-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message your coach…"
          className="flex-1 rounded-sm border border-line px-4 py-2.5 text-sm focus-visible:border-turf"
        />
        <Button type="submit" variant="accent">
          <Send size={16} />
        </Button>
      </form>
    </div>
  )
}
