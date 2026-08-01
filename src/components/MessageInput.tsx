import { useState, useRef, type KeyboardEvent } from 'react'

interface Props {
  onSend: (text: string) => void
  onTyping: () => void
  onFile: (file: File) => void
}

export default function MessageInput({ onSend, onTyping, onFile }: Props) {
  const [text, setText] = useState('')
  const [filePreview, setFilePreview] = useState<{ name: string; size: string } | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (pendingFile) {
      onFile(pendingFile)
      setPendingFile(null)
      setFilePreview(null)
      return
    }
    if (!text.trim()) return
    onSend(text)
    setText('')
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
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`
    setPendingFile(file)
    setFilePreview({ name: file.name, size: sizeStr })
    e.target.value = ''
  }

  const cancelFile = () => {
    setPendingFile(null)
    setFilePreview(null)
  }

  const canSend = pendingFile || text.trim()

  return (
    <div
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-primary)',
      }}
    >
      {/* File preview strip */}
      {filePreview && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 16px',
          background: 'var(--accent-soft)',
          borderBottom: '1px solid var(--border)',
        }}>
          {/* File icon */}
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {filePreview.name}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{filePreview.size}</p>
          </div>
          <button
            onClick={cancelFile}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px', borderRadius: '6px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Input row */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
        {/* Attach button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Attach file"
          style={{
            width: '40px', height: '40px', borderRadius: '11px',
            background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'var(--text-secondary)',
            flexShrink: 0, transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-soft)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Text area */}
        <div style={{
          flex: 1, background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
          borderRadius: '14px', padding: '10px 14px', display: 'flex', alignItems: 'flex-end',
        }}>
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={pendingFile ? 'File ready — press send' : 'Message… (Enter to send, Shift+Enter for newline)'}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKey}
            disabled={!!pendingFile}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              resize: 'none', fontSize: '14px', color: 'var(--text-primary)',
              fontFamily: 'inherit', lineHeight: '1.5', maxHeight: '120px', overflowY: 'auto',
              opacity: pendingFile ? 0.4 : 1,
            }}
          />
          {text.length > 400 && (
            <span style={{ fontSize: '11px', color: text.length >= 490 ? '#ef4444' : 'var(--text-secondary)', marginLeft: '8px', flexShrink: 0 }}>
              {500 - text.length}
            </span>
          )}
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: canSend ? 'var(--accent)' : 'var(--bg-tertiary)',
            border: 'none', cursor: canSend ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background 0.15s ease',
          }}
          onMouseEnter={e => { if (canSend) e.currentTarget.style.background = 'var(--accent-hover)' }}
          onMouseLeave={e => { e.currentTarget.style.background = canSend ? 'var(--accent)' : 'var(--bg-tertiary)' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 9L16 2L9 16L8 10L2 9z" fill={canSend ? 'var(--text-on-accent)' : 'var(--text-secondary)'} strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
