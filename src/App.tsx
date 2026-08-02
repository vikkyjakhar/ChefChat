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

type ExpiryOption = 'none' | '1h' | '1d'
const EXPIRY_LABELS: Record<ExpiryOption, string> = { none: 'Until room closes', '1h': 'Last 1 hour', '1d': 'Last 24 hours' }
const EXPIRY_MS: Record<ExpiryOption, number> = { none: Infinity, '1h': 3_600_000, '1d': 86_400_000 }

function InviteButton({ roomId }: { roomId: string }) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')
  const copy = () => {
    const url = `${window.location.origin}${window.location.pathname}?join=${roomId}`
    copyText(url).then(() => { setState('copied'); setTimeout(() => setState('idle'), 2000) })
  }
  return (
    <button
      onClick={copy}
      title="Copy invite link"
      style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        padding: '5px 10px', border: '1.5px solid var(--border)',
        borderRadius: '8px', background: state === 'copied' ? 'var(--accent-soft)' : 'var(--bg-tertiary)',
        color: state === 'copied' ? 'var(--accent)' : 'var(--text-secondary)',
        cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
        transition: 'background 0.15s, color 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      {state === 'copied' ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Invite
        </>
      )}
    </button>
  )
}

function ChatApp({ userName, roomId, password, onJoinError }: { userName: string; roomId: string; password: string; onJoinError: (err: string) => void }) {
  const { messages, onlineUsers, typingUsers, connected, error, isCreator, e2eeReady, sendMessage, sendFile, emitTyping } = useChat(userName, roomId, password)
  const isLocked = password.trim().length > 0

  // Kick back to join screen if server rejects the password
  useEffect(() => {
    if (error && error.toLowerCase().includes('password')) {
      onJoinError(error)
    }
  }, [error])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expiry, setExpiry] = useState<ExpiryOption>('none')
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('chat-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('chat-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const cutoff = Date.now() - EXPIRY_MS[expiry]
  const visibleMessages = expiry === 'none' ? messages : messages.filter(m => m.createdAt >= cutoff)

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

        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <h1 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                ChefChat
              </h1>
              {isCreator && (
                <span title="You created this room" style={{ fontSize: '14px', lineHeight: 1 }}>👑</span>
              )}
              {isLocked && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" title="Password protected">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
              {/* E2EE badge */}
              <span
                title={e2eeReady ? 'End-to-End Encrypted — the server cannot read your messages' : 'Deriving encryption key…'}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '3px',
                  padding: '2px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.04em', lineHeight: 1.4,
                  background: e2eeReady ? 'var(--accent-soft)' : 'var(--bg-tertiary)',
                  color: e2eeReady ? 'var(--accent)' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  transition: 'background 0.3s, color 0.3s',
                  userSelect: 'none',
                }}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                E2EE
              </span>
            </div>
            {/* Live participant count */}
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
              {onlineUsers.length}/100 participants
            </p>
          </div>
        </div>

        {/* Expiry picker */}
        <select
          value={expiry}
          onChange={e => setExpiry(e.target.value as ExpiryOption)}
          title="Message expiry"
          style={{
            padding: '5px 8px', border: '1.5px solid var(--border)', borderRadius: '8px',
            background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
            fontSize: '12px', fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0,
            outline: 'none',
          }}
        >
          {(Object.keys(EXPIRY_LABELS) as ExpiryOption[]).map(k => (
            <option key={k} value={k}>{EXPIRY_LABELS[k]}</option>
          ))}
        </select>

        {/* Invite link */}
        <InviteButton roomId={roomId} />

        {/* Room code badge — click to copy */}
        <RoomBadge roomId={roomId} />

        {/* Animated theme toggle */}
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <Sidebar users={onlineUsers} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <MessageList messages={visibleMessages} typingUsers={typingUsers} />
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
  const [session, setSession] = useState<{ userName: string; roomId: string; password: string } | null>(null)
  const [joinError, setJoinError] = useState<string | null>(null)
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
        <div style={{ position: 'absolute', top: '20px', right: '24px', zIndex: 10 }}>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
        </div>
        <JoinScreen
          onJoin={(userName, roomId, password) => {
            setJoinError(null)
            setSession({ userName, roomId, password })
          }}
          joinError={joinError}
        />
      </div>
    )
  }

  return (
    <ChatApp
      userName={session.userName}
      roomId={session.roomId}
      password={session.password}
      onJoinError={err => { setSession(null); setJoinError(err) }}
    />
  )
}
