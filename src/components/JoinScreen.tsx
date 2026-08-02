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
  onJoin: (name: string, roomId: string, password: string) => void
  joinError?: string | null
}

function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function Logo() {
  return (
    <div style={{
      width: '64px', height: '64px', borderRadius: '18px',
      background: 'var(--accent)', margin: '0 auto 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 8C4 6.343 5.343 5 7 5h18c1.657 0 3 1.343 3 3v12c0 1.657-1.343 3-3 3H18l-4 4-2-4H7c-1.657 0-3-1.343-3-3V8z" fill="white" fillOpacity="0.95" />
      </svg>
    </div>
  )
}

function NameInput({ value, onChange, error }: { value: string; onChange: (v: string) => void; error: string }) {
  return (
    <div style={{ marginBottom: error ? '8px' : '16px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textAlign: 'left', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        Display Name
      </label>
      <input
        type="text" placeholder="e.g. Alex" value={value}
        onChange={e => onChange(e.target.value)} maxLength={20} autoFocus
        style={{
          width: '100%', padding: '11px 14px', fontSize: '15px',
          border: `1.5px solid ${error ? '#ef4444' : 'var(--border)'}`,
          borderRadius: '11px', background: 'var(--bg-primary)',
          color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
        }}
      />
      {error && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0', textAlign: 'left' }}>{error}</p>}
    </div>
  )
}

function PasswordInput({ value, onChange, label, placeholder, optional }: {
  value: string; onChange: (v: string) => void
  label: string; placeholder: string; optional?: boolean
}) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
        {optional && <span style={{ fontSize: '10px', fontWeight: 400, color: 'var(--text-secondary)', textTransform: 'none', letterSpacing: 0 }}>optional</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          maxLength={50}
          style={{
            width: '100%', padding: '11px 44px 11px 14px', fontSize: '15px',
            border: '1.5px solid var(--border)', borderRadius: '11px',
            background: 'var(--bg-primary)', color: 'var(--text-primary)',
            outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', padding: '2px',
          }}
        >
          {show ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

function btnStyle(active: boolean) {
  return ({
    flex: 1, padding: '9px', fontSize: '14px', fontWeight: 600,
    border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'inherit',
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? 'var(--text-on-accent)' : 'var(--text-secondary)',
    transition: 'background 0.15s, color 0.15s',
  })
}

function submitBtn(label: string) {
  return (
    <button
      type="submit"
      style={{
        width: '100%', padding: '13px', fontSize: '15px', fontWeight: 600,
        color: 'var(--text-on-accent)', background: 'var(--accent)',
        border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
    >
      {label}
    </button>
  )
}

// ── Create Room ────────────────────────────────────────────────────────────────
function CreatePanel({ onJoin }: { onJoin: (name: string, roomId: string, password: string) => void }) {
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [roomId] = useState(generateRoomId)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    copyText(roomId).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim().slice(0, 20)
    if (!trimmed) { setNameError('Please enter a display name.'); return }
    onJoin(trimmed, roomId, password.trim())
  }

  return (
    <form onSubmit={handleSubmit}>
      <NameInput value={name} onChange={v => { setName(v); setNameError('') }} error={nameError} />

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textAlign: 'left', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Room Code
        </label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{
            flex: 1, padding: '11px 14px', background: 'var(--bg-tertiary)',
            border: '1.5px solid var(--border)', borderRadius: '11px',
            fontSize: '17px', fontWeight: 700, letterSpacing: '0.18em',
            color: 'var(--accent)', fontFamily: 'monospace',
          }}>
            {roomId}
          </div>
          <button type="button" onClick={handleCopy} style={{
            padding: '11px 14px', background: copied ? 'var(--accent-soft)' : 'var(--bg-secondary)',
            border: '1.5px solid var(--border)', borderRadius: '11px', cursor: 'pointer',
            color: copied ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '13px',
            fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'left' }}>
          Share this ID with someone so they can join your room.
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px',
          padding: '7px 10px', background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)', borderRadius: '8px',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Up to <strong style={{ color: 'var(--accent)' }}>100 participants</strong>
          </span>
        </div>
      </div>

      <PasswordInput
        value={password} onChange={setPassword}
        label="Room Password" placeholder="Set a password (optional)"
        optional
      />

      {password && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
          background: 'var(--accent-soft)', borderRadius: '10px', marginBottom: '16px',
          border: '1px solid var(--border)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 500 }}>
            Room is password protected — share the password with your guests
          </span>
        </div>
      )}

      {submitBtn('Create & Enter Room')}
    </form>
  )
}

// ── Join Room ──────────────────────────────────────────────────────────────────
function JoinPanel({ onJoin, joinError, prefillRoomId = '' }: { onJoin: (name: string, roomId: string, password: string) => void; joinError?: string | null; prefillRoomId?: string }) {
  const [name, setName] = useState('')
  const [roomId, setRoomId] = useState(prefillRoomId.toUpperCase())
  const [password, setPassword] = useState('')
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
    onJoin(trimmedName, trimmedRoom, password.trim())
  }

  return (
    <form onSubmit={handleSubmit}>
      <NameInput value={name} onChange={v => { setName(v); setNameError('') }} error={nameError} />

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textAlign: 'left', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Room ID
        </label>
        <input
          type="text" placeholder="e.g. ABCD1234"
          value={roomId}
          onChange={e => { setRoomId(e.target.value.toUpperCase()); setRoomError('') }}
          maxLength={20}
          style={{
            width: '100%', padding: '11px 14px', fontSize: '17px', fontWeight: 700,
            letterSpacing: '0.18em', border: `1.5px solid ${roomError ? '#ef4444' : 'var(--border)'}`,
            borderRadius: '11px', background: 'var(--bg-primary)', color: 'var(--accent)',
            outline: 'none', fontFamily: 'monospace',
          }}
        />
        {roomError && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0', textAlign: 'left' }}>{roomError}</p>}
      </div>

      <PasswordInput
        value={password} onChange={setPassword}
        label="Room Password" placeholder="Enter password if required"
        optional
      />

      {/* Server-side join error (wrong password etc.) */}
      {joinError && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
          background: '#fef2f2', borderRadius: '10px', marginBottom: '16px',
          border: '1px solid #fecaca',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 500 }}>{joinError}</span>
        </div>
      )}

      {submitBtn('Join Room')}
    </form>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function JoinScreen({ onJoin, joinError }: Props) {
  const prefillId = new URLSearchParams(window.location.search).get('join') ?? ''
  const [tab, setTab] = useState<'create' | 'join'>(prefillId ? 'join' : 'create')

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg-primary)', padding: '24px',
    }}>
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px',
        boxShadow: 'var(--shadow-md)', textAlign: 'center',
      }}>
        <Logo />
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>ChefChat</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 28px' }}>
          Private rooms — no two rooms share the same ID
        </p>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', gap: '4px', background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)', borderRadius: '12px',
          padding: '4px', marginBottom: '28px',
        }}>
          <button style={btnStyle(tab === 'create')} onClick={() => setTab('create')}>Create Room</button>
          <button style={btnStyle(tab === 'join')} onClick={() => setTab('join')}>Join Room</button>
        </div>

        {tab === 'create'
          ? <CreatePanel onJoin={onJoin} />
          : <JoinPanel onJoin={onJoin} joinError={joinError} prefillRoomId={prefillId} />
        }
      </div>
    </div>
  )
}
