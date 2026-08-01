import { useState, useEffect } from 'react'
import JoinScreen from './components/JoinScreen'
import Sidebar from './components/Sidebar'
import MessageList from './components/MessageList'
import MessageInput from './components/MessageInput'
import { useChat } from './hooks/useChat'

function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function RoomBadge({ roomId }: { roomId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId).then(() => {
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
  const { messages, onlineUsers, typingUsers, connected, error, sendMessage, emitTyping } = useChat(userName, roomId)
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

        {/* Theme toggle */}
        <button
          onClick={() => setIsDark(d => !d)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            flexShrink: 0,
          }}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <ThemeIcon dark={isDark} />
        </button>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <Sidebar users={onlineUsers} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <MessageList messages={messages} typingUsers={typingUsers} />
          <MessageInput onSend={sendMessage} onTyping={emitTyping} />
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
  const [isDark] = useState(() => {
    const saved = localStorage.getItem('chat-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  if (!session) {
    return <JoinScreen onJoin={(userName, roomId) => setSession({ userName, roomId })} />
  }

  return <ChatApp userName={session.userName} roomId={session.roomId} />
}
