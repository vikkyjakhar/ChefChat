import { useState, useRef, type KeyboardEvent } from 'react'

interface Props {
  onSend: (text: string) => void
  onTyping: () => void
}

export default function MessageInput({ onSend, onTyping }: Props) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text)
    setText('')
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 500)
    setText(val)
    onTyping()
    // Auto-grow textarea
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  return (
    <div
      style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
      }}
    >
      <div
        style={{
          flex: 1,
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border)',
          borderRadius: '14px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Message… (Enter to send, Shift+Enter for newline)"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKey}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '14px',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            lineHeight: '1.5',
            maxHeight: '120px',
            overflowY: 'auto',
          }}
        />
        {text.length > 400 && (
          <span
            style={{
              fontSize: '11px',
              color: text.length >= 490 ? '#ef4444' : 'var(--text-secondary)',
              marginLeft: '8px',
              flexShrink: 0,
              alignSelf: 'flex-end',
            }}
          >
            {500 - text.length}
          </span>
        )}
      </div>

      <button
        onClick={handleSend}
        disabled={!text.trim()}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: text.trim() ? 'var(--accent)' : 'var(--bg-tertiary)',
          border: 'none',
          cursor: text.trim() ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.15s ease, transform 0.1s ease',
        }}
        onMouseEnter={e => {
          if (text.trim()) (e.currentTarget.style.background = 'var(--accent-hover)')
        }}
        onMouseLeave={e => {
          (e.currentTarget.style.background = text.trim() ? 'var(--accent)' : 'var(--bg-tertiary)')
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M2 9L16 2L9 16L8 10L2 9z"
            fill={text.trim() ? 'var(--text-on-accent)' : 'var(--text-secondary)'}
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
