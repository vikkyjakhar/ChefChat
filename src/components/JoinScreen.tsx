import { useState, type FormEvent } from 'react'

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

interface Props {
  onJoin: (name: string, roomId: string) => void
}

function generateRoomId(): string {
  // 8 uppercase alphanumeric chars, easy to read and share
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function Logo() {
  return (
    <div
      style={{
        width: '64px',
        height: '64px',
        borderRadius: '18px',
        background: 'var(--accent)',
        margin: '0 auto 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M4 8C4 6.343 5.343 5 7 5h18c1.657 0 3 1.343 3 3v12c0 1.657-1.343 3-3 3H18l-4 4-2-4H7c-1.657 0-3-1.343-3-3V8z"
          fill="white"
          fillOpacity="0.95"
        />
      </svg>
    </div>
  )
}

function NameInput({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (v: string) => void
  error: string
}) {
  return (
    <div style={{ marginBottom: error ? '8px' : '20px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textAlign: 'left', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        Display Name
      </label>
      <input
        type="text"
        placeholder="e.g. Alex"
        value={value}
        onChange={e => onChange(e.target.value)}
        maxLength={20}
        autoFocus
        style={{
          width: '100%',
          padding: '11px 14px',
          fontSize: '15px',
          border: `1.5px solid ${error ? '#ef4444' : 'var(--border)'}`,
          borderRadius: '11px',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          outline: 'none',
          fontFamily: 'inherit',
        }}
      />
      {error && (
        <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0', textAlign: 'left' }}>
          {error}
        </p>
      )}
    </div>
  )
}

// ── Create Room panel ──────────────────────────────────────────────────────────
function CreatePanel({ onJoin }: { onJoin: (name: string, roomId: string) => void }) {
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [roomId] = useState(generateRoomId)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    copyText(roomId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim().slice(0, 20)
    if (!trimmed) { setNameError('Please enter a display name.'); return }
    onJoin(trimmed, roomId)
  }

  return (
    <form onSubmit={handleSubmit}>
      <NameInput value={name} onChange={v => { setName(v); setNameError('') }} error={nameError} />

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textAlign: 'left', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Your Room ID
        </label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div
            style={{
              flex: 1,
              padding: '11px 14px',
              background: 'var(--bg-tertiary)',
              border: '1.5px solid var(--border)',
              borderRadius: '11px',
              fontSize: '17px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: 'var(--accent)',
              fontFamily: 'monospace',
            }}
          >
            {roomId}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            title="Copy room ID"
            style={{
              padding: '11px 14px',
              background: copied ? 'var(--accent-soft)' : 'var(--bg-secondary)',
              border: '1.5px solid var(--border)',
              borderRadius: '11px',
              cursor: 'pointer',
              color: copied ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'left' }}>
          Share this ID with someone so they can join your room.
        </p>
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '13px',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--text-on-accent)',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => ((e.currentTarget.style.background = 'var(--accent-hover)'))}
        onMouseLeave={e => ((e.currentTarget.style.background = 'var(--accent)'))}
      >
        Create &amp; Enter Room
      </button>
    </form>
  )
}

// ── Join Room panel ────────────────────────────────────────────────────────────
function JoinPanel({ onJoin }: { onJoin: (name: string, roomId: string) => void }) {
  const [name, setName] = useState('')
  const [roomId, setRoomId] = useState('')
  const [nameError, setNameError] = useState('')
  const [roomError, setRoomError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim().slice(0, 20)
    const trimmedRoom = roomId.trim().toUpperCase().replace(/\s/g, '')
    let ok = true
    if (!trimmedName) { setNameError('Please enter a display name.'); ok = false }
    if (trimmedRoom.length < 4) { setRoomError('Please enter a valid Room ID.'); ok = false }
    if (!ok) return
    onJoin(trimmedName, trimmedRoom)
  }

  return (
    <form onSubmit={handleSubmit}>
      <NameInput value={name} onChange={v => { setName(v); setNameError('') }} error={nameError} />

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textAlign: 'left', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Room ID
        </label>
        <input
          type="text"
          placeholder="e.g. ABCD1234"
          value={roomId}
          onChange={e => { setRoomId(e.target.value.toUpperCase()); setRoomError('') }}
          maxLength={20}
          style={{
            width: '100%',
            padding: '11px 14px',
            fontSize: '17px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            border: `1.5px solid ${roomError ? '#ef4444' : 'var(--border)'}`,
            borderRadius: '11px',
            background: 'var(--bg-primary)',
            color: 'var(--accent)',
            outline: 'none',
            fontFamily: 'monospace',
          }}
        />
        {roomError && (
          <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0', textAlign: 'left' }}>
            {roomError}
          </p>
        )}
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '13px',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--text-on-accent)',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => ((e.currentTarget.style.background = 'var(--accent-hover)'))}
        onMouseLeave={e => ((e.currentTarget.style.background = 'var(--accent)'))}
      >
        Join Room
      </button>
    </form>
  )
}

// ── Main join screen ───────────────────────────────────────────────────────────
export default function JoinScreen({ onJoin }: Props) {
  const [tab, setTab] = useState<'create' | 'join'>('create')

  const tabStyle = (active: boolean) => ({
    flex: 1,
    padding: '9px',
    fontSize: '14px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '9px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? 'var(--text-on-accent)' : 'var(--text-secondary)',
    transition: 'background 0.15s, color 0.15s',
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '40px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
        }}
      >
        <Logo />

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
          ChefChat
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 28px' }}>
          Private rooms — no two rooms share the same ID
        </p>

        {/* Tab switcher */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '28px',
          }}
        >
          <button style={tabStyle(tab === 'create')} onClick={() => setTab('create')}>
            Create Room
          </button>
          <button style={tabStyle(tab === 'join')} onClick={() => setTab('join')}>
            Join Room
          </button>
        </div>

        {tab === 'create' ? (
          <CreatePanel onJoin={onJoin} />
        ) : (
          <JoinPanel onJoin={onJoin} />
        )}
      </div>
    </div>
  )
}
