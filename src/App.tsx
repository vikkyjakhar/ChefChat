import { useState, useEffect } from 'react'

function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => execCopy(text))
  }
  return execCopy(text)
}

function execCopy(text: string): Promise<void> {
  const el = document.createElement('textarea')
  el.value = text
  el.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  return Promise.resolve()
}
import JoinScreen from './components/JoinScreen'
import Sidebar from './components/Sidebar'
import MessageList from './components/MessageList'
import MessageInput from './components/MessageInput'
import { useChat } from './hooks/useChat'

function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <label className="switch" title={isDark ? 'Switch to light' : 'Switch to dark'}>
      <span className="sun">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g fill="#ffd43b">
            <circle r="5" cy="12" cx="12" />
            <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1-.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1-.75.29zm-12.02 12.02a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1-.7.24zm6.36-14.36a1 1 0 0 1-1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1-1 1zm0 17a1 1 0 0 1-1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1-1 1zm-5.66-14.66a1 1 0 0 1-.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1-.71.29zm12.02 12.02a1 1 0 0 1-.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1-.71.24z" />
          </g>
        </svg>
      </span>
      <span className="moon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
        </svg>
      </span>
      <input
        type="checkbox"
        className="input"
        checked={isDark}
        onChange={onToggle}
      />
      <span className="slider" />
    </label>
  )
}

function RoomBadge({ roomId }: { roomId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    copyText(roomId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      title="Click to copy Room ID"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 10px',
        background: copied ? 'var(--accent-soft)' : 'var(--bg-tertiary)',
        border: '1.5px solid var(--border)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontFamily: 'monospace',
        fontSize: '13px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: copied ? 'var(--accent)' : 'var(--text-primary)',
        transition: 'background 0.15s, color 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {/* Key icon */}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
        <circle cx="7.5" cy="15.5" r="5.5" />
        <path d="M21 2l-9.6 9.6" /><path d="M15.5 7.5l3 3" /><path d="M18 5l3 3" />
      </svg>
      {copied ? '✓ Copied' : roomId}
    </button>
  )
}

function ChatApp({ userName, roomId }: { userName: string; roomId: string }) {
  const { messages, onlineUsers, typingUsers, connected, error, sendMessage, sendFile, emitTyping } = useChat(userName, roomId)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('chat-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('chat-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Connection status banner */}
      {(!connected || error) && (
        <div
          className="reconnecting-banner"
          style={{
            background: error ? '#dc2626' : '#f97316',
            color: 'white',
            textAlign: 'center',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 500,
            zIndex: 100,
          }}
        >
          {error ?? 'Connecting to server…'}
        </div>
      )}

      {/* Header */}
      <header
        style={{
          height: '56px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '10px',
          flexShrink: 0,
          boxShadow: 'var(--shadow)',
          zIndex: 5,
        }}
      >
        {/* Hamburger (mobile) */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="hamburger"
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            padding: '4px',
            borderRadius: '8px',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
            <path d="M4 8C4 6.343 5.343 5 7 5h18c1.657 0 3 1.343 3 3v12c0 1.657-1.343 3-3 3H18l-4 4-2-4H7c-1.657 0-3-1.343-3-3V8z" fill="white" />
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
            ChefChat
          </h1>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
            {onlineUsers.length} online
          </p>
        </div>

        {/* Room ID badge — click to copy */}
        <RoomBadge roomId={roomId} />

        {/* Animated theme toggle */}
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <Sidebar users={onlineUsers} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <MessageList messages={messages} typingUsers={typingUsers} />
          <MessageInput onSend={sendMessage} onTyping={emitTyping} onFile={sendFile} />
        </main>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .hamburger { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState<{ userName: string; roomId: string } | null>(null)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('chat-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('chat-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  if (!session) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Toggle sits top-right on the join screen */}
        <div style={{ position: 'absolute', top: '20px', right: '24px', zIndex: 10 }}>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
        </div>
        <JoinScreen onJoin={(userName, roomId) => setSession({ userName, roomId })} />
      </div>
    )
  }

  return <ChatApp userName={session.userName} roomId={session.roomId} />
}
