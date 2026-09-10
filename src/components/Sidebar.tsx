import { useState } from 'react'
import type { User } from '../hooks/useChat'

type ExpiryOption = 'none' | '1h' | '1d'
const EXPIRY_LABELS: Record<ExpiryOption, string> = {
  none: 'Until room closes',
  '1h': 'Last 1 hour',
  '1d': 'Last 24 hours',
}

interface Props {
  users: User[]
  open: boolean
  onClose: () => void
  roomId: string
  expiry: ExpiryOption
  onExpiryChange: (v: ExpiryOption) => void
}

const AVATAR_COLORS = [
  '#16a34a', '#0284c7', '#7c3aed', '#db2777', '#ea580c',
  '#ca8a04', '#0891b2', '#be185d', '#4f46e5', '#059669',
]

function avatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text).catch(() => execCopy(text))
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

function RoomOptionsPanel({ roomId, expiry, onExpiryChange }: {
  roomId: string
  expiry: ExpiryOption
  onExpiryChange: (v: ExpiryOption) => void
}) {
  const [codeCopied, setCodeCopied] = useState(false)
  const [inviteCopied, setInviteCopied] = useState(false)

  const copyCode = () => {
    copyText(roomId).then(() => { setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000) })
  }
  const copyInvite = () => {
    const url = `${window.location.origin}${window.location.pathname}?join=${roomId}`
    copyText(url).then(() => { setInviteCopied(true); setTimeout(() => setInviteCopied(false), 2000) })
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 12px', borderRadius: '10px',
    background: 'var(--bg-primary)', border: '1px solid var(--border)',
    marginBottom: '8px',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)',
    textTransform: 'uppercase', letterSpacing: '0.05em',
  }
  const btnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '5px 10px', borderRadius: '7px', border: '1.5px solid var(--border)',
    background: active ? 'var(--accent-soft)' : 'var(--bg-secondary)',
    color: active ? 'var(--accent)' : 'var(--text-secondary)',
    fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all 0.15s',
  })

  return (
    <div className="room-options-panel" style={{ padding: '12px 12px 4px' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px 2px' }}>
        Room Options
      </p>

      {/* Room Code */}
      <div style={rowStyle}>
        <div>
          <p style={labelStyle}>Room Code</p>
          <p style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent)', fontFamily: 'monospace' }}>
            {roomId}
          </p>
        </div>
        <button style={btnStyle(codeCopied)} onClick={copyCode}>
          {codeCopied
            ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Copied</>
            : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
          }
        </button>
      </div>

      {/* Invite Link */}
      <div style={rowStyle}>
        <div>
          <p style={labelStyle}>Invite Link</p>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>Share with anyone</p>
        </div>
        <button style={btnStyle(inviteCopied)} onClick={copyInvite}>
          {inviteCopied
            ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Copied</>
            : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>Invite</>
          }
        </button>
      </div>

      {/* Message Expiry */}
      <div style={{ ...rowStyle, flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        <p style={labelStyle}>⏱ Message Expiry</p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', width: '100%' }}>
          {(Object.keys(EXPIRY_LABELS) as ExpiryOption[]).map(k => (
            <button
              key={k}
              onClick={() => onExpiryChange(k)}
              style={{
                flex: 1, padding: '6px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                border: '1.5px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit',
                background: expiry === k ? 'var(--accent)' : 'var(--bg-secondary)',
                color: expiry === k ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
            >
              {EXPIRY_LABELS[k]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0 12px' }} />
    </div>
  )
}

export default function Sidebar({ users, open, onClose, roomId, expiry, onExpiryChange }: Props) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 10, display: 'none' }}
          className="mobile-overlay"
        />
      )}

      <aside
        style={{
          width: '240px', flexShrink: 0,
          background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', overflowY: 'auto',
          transition: 'transform 0.25s ease',
        }}
        className={`sidebar ${open ? 'sidebar-open' : ''}`}
      >
        {/* Room options — only visible on mobile (CSS hides on desktop) */}
        <div className="room-options-panel-wrap">
          <RoomOptionsPanel roomId={roomId} expiry={expiry} onExpiryChange={onExpiryChange} />
        </div>

        <div style={{ padding: '20px 16px 12px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: 0 }}>
            Online — {users.length}
          </p>
        </div>

        <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {users.map(user => (
            <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: avatarColor(user.name),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '14px', fontWeight: 600, flexShrink: 0,
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </p>
                {user.isCreator && <span title="Room creator" style={{ fontSize: '12px', lineHeight: 1, flexShrink: 0 }}>👑</span>}
              </div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </aside>

      <style>{`
        /* Desktop: hide the room options panel inside sidebar (shown in header instead) */
        .room-options-panel-wrap { display: none; }

        @media (max-width: 680px) {
          /* Show room options inside sidebar on mobile */
          .room-options-panel-wrap { display: block; }

          .sidebar {
            position: fixed;
            top: 56px; left: 0; bottom: 0;
            z-index: 20;
            transform: translateX(-100%);
            width: 300px !important;
            box-shadow: var(--shadow-md);
          }
          .sidebar.sidebar-open { transform: translateX(0); }
          .mobile-overlay { display: block !important; }
        }
      `}</style>
    </>
  )
}
