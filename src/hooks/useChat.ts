import { useState, useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

export type MessageType = 'chat' | 'system' | 'file'

export interface Message {
  id: string
  type: MessageType
  text: string
  sender?: string
  timestamp: string
  isOwn?: boolean
  // file attachment fields
  fileName?: string
  fileType?: string
  fileData?: string  // base64 data URL
  fileSize?: number
}

export interface User {
  id: string
  name: string
}

const MAX_LEN = 500

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function ts(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

const SERVER_URL = (import.meta.env.VITE_SOCKET_URL as string) || 'https://chefchat-tkks.onrender.com'

export function useChat(userName: string, roomId: string, password = '') {
  const [messages, setMessages] = useState<Message[]>([])
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const socketRef = useRef<Socket | null>(null)
  const typingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const typingEmitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const addMsg = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg])
  }, [])

  useEffect(() => {
    if (!userName || !roomId) return

    if (!SERVER_URL) {
      setError('Add your server URL as VITE_SOCKET_URL in Figma Make secrets.')
      // Use a ref-guarded flag so Strict Mode double-invoke doesn't duplicate the message
      return
    }

    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnectionDelayMax: 5000,
    })
    socketRef.current = socket

    // ── Connection lifecycle ──────────────────────────────────────────────────
    socket.on('connect', () => {
      setConnected(true)
      setError(null)
      // Join the room with our display name and optional password
      socket.emit('join', { roomId, userName, password })
      addMsg({ id: uid(), type: 'system', text: 'You joined the chat', timestamp: ts() })
    })

    socket.on('disconnect', (reason) => {
      setConnected(false)
      if (reason !== 'io client disconnect') {
        addMsg({ id: uid(), type: 'system', text: 'Disconnected — reconnecting…', timestamp: ts() })
      }
    })

    socket.on('connect_error', () => {
      setConnected(false)
      setError(`Cannot reach server at ${SERVER_URL}`)
    })

    socket.on('join:error', (data: { message: string }) => {
      setError(data.message)
    })

    socket.on('reconnect', () => {
      socket.emit('join', { roomId, userName })
      addMsg({ id: uid(), type: 'system', text: 'Reconnected ✓', timestamp: ts() })
    })

    // ── User presence ─────────────────────────────────────────────────────────
    socket.on('users', (users: User[]) => {
      setOnlineUsers(users)
    })

    socket.on('user:joined', (user: User) => {
      setOnlineUsers(prev => prev.find(u => u.id === user.id) ? prev : [...prev, user])
      addMsg({ id: uid(), type: 'system', text: `${user.name} joined the chat`, timestamp: ts() })
    })

    socket.on('user:left', (user: User) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== user.id))
      setTypingUsers(prev => prev.filter(n => n !== user.name))
      addMsg({ id: uid(), type: 'system', text: `${user.name} left the chat`, timestamp: ts() })
    })

    // System messages from server (e.g. join/leave broadcast)
    socket.on('system', (data: { text: string; timestamp: string }) => {
      // Avoid duplicate if server also broadcasts what we already added locally
    })

    // ── Chat messages ─────────────────────────────────────────────────────────
    socket.on('message', (data: { id: string; text: string; sender: string; timestamp: string }) => {
      setTypingUsers(prev => prev.filter(n => n !== data.sender))
      clearTimeout(typingTimers.current[data.sender])
      setMessages(prev => [
        ...prev,
        {
          id: data.id,
          type: 'chat',
          text: escapeHtml(data.text.slice(0, MAX_LEN)),
          sender: data.sender,
          timestamp: data.timestamp,
          isOwn: false,
        },
      ])
    })

    // ── File messages ─────────────────────────────────────────────────────────
    socket.on('file', (data: { id: string; fileName: string; fileType: string; fileData: string; fileSize: number; sender: string; timestamp: string }) => {
      setMessages(prev => [
        ...prev,
        {
          id: data.id,
          type: 'file',
          text: data.fileName,
          fileName: data.fileName,
          fileType: data.fileType,
          fileData: data.fileData,
          fileSize: data.fileSize,
          sender: data.sender,
          timestamp: data.timestamp,
          isOwn: false,
        },
      ])
    })

    // ── Typing indicator ──────────────────────────────────────────────────────
    socket.on('typing', (data: { name: string; id: string }) => {
      setTypingUsers(prev => prev.includes(data.name) ? prev : [...prev, data.name])
      clearTimeout(typingTimers.current[data.id])
      typingTimers.current[data.id] = setTimeout(() => {
        setTypingUsers(prev => prev.filter(n => n !== data.name))
      }, 2500)
    })

    return () => {
      socket.disconnect()
    }
  }, [userName, roomId, password])

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim().slice(0, MAX_LEN)
    if (!trimmed || !socketRef.current) return

    const msgTs = ts()
    // Show in own UI immediately
    setMessages(prev => [
      ...prev,
      { id: uid(), type: 'chat', text: escapeHtml(trimmed), sender: userName, timestamp: msgTs, isOwn: true },
    ])
    // Emit to server — server relays to others
    socketRef.current.emit('message', { text: trimmed, timestamp: msgTs })
  }, [userName])

  const sendFile = useCallback((file: File) => {
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB hard limit
    if (file.size > MAX_SIZE) {
      alert('File too large — maximum size is 5MB. For images, try compressing first.')
      return
    }

    const doSend = (fileData: string, fileType: string, fileSize: number) => {
      const msgTs = ts()
      const msgId = uid()
      setMessages(prev => [
        ...prev,
        {
          id: msgId, type: 'file', text: file.name,
          fileName: file.name, fileType,
          fileData, fileSize,
          sender: userName, timestamp: msgTs, isOwn: true,
        },
      ])
      socketRef.current?.emit('file', {
        id: msgId, fileName: file.name, fileType,
        fileData, fileSize, timestamp: msgTs,
      })
    }

    // Compress images before sending to keep payload small
    if (file.type.startsWith('image/')) {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        const canvas = document.createElement('canvas')
        const MAX_DIM = 1200
        let { width, height } = img
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) { height = Math.round(height * MAX_DIM / width); width = MAX_DIM }
          else { width = Math.round(width * MAX_DIM / height); height = MAX_DIM }
        }
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
        const compressed = canvas.toDataURL('image/jpeg', 0.75)
        const approxSize = Math.round(compressed.length * 0.75)
        doSend(compressed, 'image/jpeg', approxSize)
      }
      img.onerror = () => {
        // Fall back to raw read if image decode fails
        const reader = new FileReader()
        reader.onload = () => doSend(reader.result as string, file.type, file.size)
        reader.readAsDataURL(file)
      }
      img.src = objectUrl
    } else {
      const reader = new FileReader()
      reader.onload = () => doSend(reader.result as string, file.type, file.size)
      reader.readAsDataURL(file)
    }
  }, [userName])

  const emitTyping = useCallback(() => {
    if (typingEmitTimer.current || !socketRef.current) return
    socketRef.current.emit('typing')
    typingEmitTimer.current = setTimeout(() => {
      typingEmitTimer.current = null
    }, 1400)
  }, [])

  return { messages, onlineUsers, typingUsers, connected, error, sendMessage, sendFile, emitTyping }
}
