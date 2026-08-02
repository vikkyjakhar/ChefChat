import type { User } from '../hooks/useChat'

interface Props {
  users: User[]
  open: boolean
  onClose: () => void
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

export default function Sidebar({ users, open, onClose }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 10,
            display: 'none',
          }}
          className="mobile-overlay"
        />
      )}

      <aside
        style={{
          width: '240px',
          flexShrink: 0,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          transition: 'transform 0.25s ease',
        }}
        className={`sidebar ${open ? 'sidebar-open' : ''}`}
      >
        <div style={{ padding: '20px 16px 12px' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            Online — {users.length}
          </p>
        </div>

        <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {users.map(user => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '10px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: avatarColor(user.name),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.name}
                </p>
                {user.isCreator && (
                  <span title="Room creator" style={{ fontSize: '12px', lineHeight: 1, flexShrink: 0 }}>👑</span>
                )}
              </div>
              {/* Online dot */}
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  flexShrink: 0,
                }}
              />
            </div>
          ))}
        </div>
      </aside>

      <style>{`
        @media (max-width: 680px) {
          .sidebar {
            position: fixed;
            top: 56px;
            left: 0;
            bottom: 0;
            z-index: 20;
            transform: translateX(-100%);
            width: 260px !important;
            box-shadow: var(--shadow-md);
          }
          .sidebar.sidebar-open {
            transform: translateX(0);
          }
          .mobile-overlay {
            display: block !important;
          }
        }
      `}</style>
    </>
  )
}
