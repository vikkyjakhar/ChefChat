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
        if (msg.type === 'system') {
          return (
            <div
              key={msg.id}
              className="message-enter"
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '8px 0',
              }}
            >
              <span
                style={{
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  fontSize: '12px',
                  fontWeight: 500,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                }}
              >
                {msg.text} · {msg.timestamp}
              </span>
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
