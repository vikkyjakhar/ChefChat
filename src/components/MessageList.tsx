import { useEffect, useRef } from 'react'
import type { Message } from '../hooks/useChat'

interface Props {
  messages: Message[]
  typingUsers: string[]
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

export default function MessageList({ messages, typingUsers }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  // Track whether user has scrolled up
  const isAtBottomRef = useRef(true)

  const handleScroll = () => {
    const el = listRef.current
    if (!el) return
    isAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60
  }

  useEffect(() => {
    if (isAtBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, typingUsers])

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 16px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {messages.length === 0 && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.4">
            <path
              d="M6 10C6 7.791 7.791 6 10 6h20c2.209 0 4 1.791 4 4v14c0 2.209-1.791 4-4 4H23l-4 5-3-5H10c-2.209 0-4-1.791-4-4V10z"
              fill="var(--accent)"
            />
          </svg>
          <span>No messages yet. Say hello!</span>
        </div>
      )}

      {messages.map(msg => {
        // ── File bubble ────────────────────────────────────────────────────────
        if (msg.type === 'file') {
          const isImage = msg.fileType?.startsWith('image/')
          const bubble = (
            <div style={{
              background: msg.isOwn ? 'var(--bubble-sent-bg)' : 'var(--bubble-received-bg)',
              borderRadius: msg.isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              maxWidth: '260px',
            }}>
              {isImage ? (
                <a href={msg.fileData} download={msg.fileName} title="Click to download">
                  <img
                    src={msg.fileData}
                    alt={msg.fileName}
                    style={{ display: 'block', maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                  />
                </a>
              ) : (
                <a
                  href={msg.fileData}
                  download={msg.fileName}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 14px', textDecoration: 'none',
                  }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                    background: msg.isOwn ? 'rgba(255,255,255,0.25)' : 'var(--accent-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke={msg.isOwn ? 'white' : 'var(--accent)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      margin: 0, fontSize: '13px', fontWeight: 600,
                      color: msg.isOwn ? 'var(--bubble-sent-text)' : 'var(--bubble-received-text)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{msg.fileName}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: msg.isOwn ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' }}>
                      {msg.fileSize ? (msg.fileSize > 1024 * 1024
                        ? `${(msg.fileSize / 1024 / 1024).toFixed(1)} MB`
                        : `${Math.round(msg.fileSize / 1024)} KB`) : ''} · tap to download
                    </p>
                  </div>
                </a>
              )}
            </div>
          )

          return (
            <div key={msg.id} className="message-enter" style={{
              display: 'flex',
              justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: '8px',
              marginTop: '4px',
            }}>
              {!msg.isOwn && (
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: avatarColor(msg.sender ?? ''),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '12px', fontWeight: 600, flexShrink: 0,
                }}>
                  {(msg.sender ?? '?').charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isOwn ? 'flex-end' : 'flex-start', gap: '3px' }}>
                {!msg.isOwn && (
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', paddingLeft: '4px' }}>
                    {msg.sender}
                  </span>
                )}
                {bubble}
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', paddingLeft: msg.isOwn ? 0 : '4px', paddingRight: msg.isOwn ? '4px' : 0 }}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          )
        }

        if (msg.type === 'system') {
          const joinMatch = msg.text.match(/^(.+?) joined the chat$/)
          const leftMatch = msg.text.match(/^(.+?) left the chat$/)
          const presenceName = joinMatch?.[1] ?? leftMatch?.[1] ?? null
          const isJoin = !!joinMatch

          return (
            <div key={msg.id} className="message-enter" style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                background: 'var(--accent-soft)', border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: presenceName ? '4px 12px 4px 5px' : '4px 12px',
              }}>
                {presenceName && (
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: avatarColor(presenceName),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '10px', fontWeight: 700,
                    }}>
                      {presenceName.charAt(0).toUpperCase()}
                    </div>
                    <span style={{
                      position: 'absolute', bottom: '-1px', right: '-1px',
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: isJoin ? '#22c55e' : '#94a3b8',
                      border: '1.5px solid var(--accent-soft)',
                    }} />
                  </div>
                )}
                <span style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: 500 }}>
                  {msg.text} · {msg.timestamp}
                </span>
              </div>
            </div>
          )
        }

        if (msg.isOwn) {
          return (
            <div
              key={msg.id}
              className="message-enter"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '4px',
              }}
            >
              <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                <div
                  style={{
                    background: 'var(--bubble-sent-bg)',
                    color: 'var(--bubble-sent-text)',
                    padding: '10px 14px',
                    borderRadius: '18px 18px 4px 18px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    boxShadow: 'var(--shadow)',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', paddingRight: '4px' }}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          )
        }

        return (
          <div
            key={msg.id}
            className="message-enter"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              marginTop: '4px',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: avatarColor(msg.sender ?? ''),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {(msg.sender ?? '?').charAt(0).toUpperCase()}
            </div>
            <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', paddingLeft: '4px' }}>
                {msg.sender}
              </span>
              <div
                style={{
                  background: 'var(--bubble-received-bg)',
                  color: 'var(--bubble-received-text)',
                  padding: '10px 14px',
                  borderRadius: '18px 18px 18px 4px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  boxShadow: 'var(--shadow)',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', paddingLeft: '4px' }}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        )
      })}

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
            marginTop: '4px',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: avatarColor(typingUsers[0]),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {typingUsers[0].charAt(0).toUpperCase()}
          </div>
          <div>
            <div
              style={{
                background: 'var(--bubble-received-bg)',
                padding: '12px 14px',
                borderRadius: '18px 18px 18px 4px',
                boxShadow: 'var(--shadow)',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
              }}
            >
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', paddingLeft: '4px' }}>
              {typingUsers.length === 1
                ? `${typingUsers[0]} is typing…`
                : `${typingUsers.slice(0, 2).join(', ')} are typing…`}
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
