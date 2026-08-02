import { useState, useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { deriveRoomKey, encryptText, decryptText } from '../lib/crypto'

export type MessageType = 'chat' | 'system' | 'file'

export interface Message {
  id: string
  type: MessageType
  text: string
  sender?: string
  timestamp: string
  createdAt: number
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
  isCreator?: boolean
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
  const [isCreator, setIsCreator] = useState(false)
  const [e2eeReady, setE2eeReady] = useState(false)

  const socketRef = useRef<Socket | null>(null)
  const keyRef = useRef<CryptoKey | null>(null)
  const typingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const typingEmitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const addMsg = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg])
  }, [])

  useEffect(() => {
    if (!userName || !roomId) return

    if (!SERVER_URL) {
      setError('Add your server URL as VITE_SOCKET_URL in Figma Make secrets.')
      return
    }

    let cancelled = false

    // Derive E2EE key before opening the socket so it's ready for the first message
    deriveRoomKey(roomId, password).then(key => {
      if (cancelled) return  // cleanup already ran (React Strict Mode double-invoke)
      keyRef.current = key
      setE2eeReady(true)

      const socket = io(SERVER_URL, {
        transports: ['websocket', 'polling'],
        reconnectionDelayMax: 5000,
      })
      socketRef.current = socket

      socket.on('connect', () => {
        setConnected(true)
        setError(null)
        socket.emit('join', { roomId, userName, password })
        addMsg({ id: uid(), type: 'system', text: 'You joined the chat', timestamp: ts(), createdAt: Date.now() })
      })

      socket.on('disconnect', (reason) => {
        setConnected(false)
        if (reason !== 'io client disconnect') {
          addMsg({ id: uid(), type: 'system', text: 'Disconnected — reconnecting…', timestamp: ts(), createdAt: Date.now() })
        }
      })

      socket.on('connect_error', () => {
        setConnected(false)
        setError(`Cannot reach server at ${SERVER_URL}`)
      })

      socket.on('join:error', (data: { message: string }) => {
        setError(data.message)
      })

      socket.on('room:meta', (data: { isCreator: boolean }) => {
        setIsCreator(data.isCreator)
      })

      socket.on('reconnect', () => {
        socket.emit('join', { roomId, userName })
        addMsg({ id: uid(), type: 'system', text: 'Reconnected ✓', timestamp: ts(), createdAt: Date.now() })
      })

      socket.on('users', (users: User[]) => {
        setOnlineUsers(users)
      })

      socket.on('user:joined', (user: User) => {
        setOnlineUsers(prev => prev.find(u => u.id === user.id) ? prev : [...prev, user])
        addMsg({ id: uid(), type: 'system', text: `${user.name} joined the chat`, timestamp: ts(), createdAt: Date.now() })
      })

      socket.on('user:left', (user: User) => {
        setOnlineUsers(prev => prev.filter(u => u.id !== user.id))
        setTypingUsers(prev => prev.filter(n => n !== user.name))
        addMsg({ id: uid(), type: 'system', text: `${user.name} left the chat`, timestamp: ts(), createdAt: Date.now() })
      })

      socket.on('system', (_data: { text: string; timestamp: string }) => {
        // server-broadcast system messages deduped by local addMsg above
      })

      socket.on('message', async (data: { id: string; text: string; sender: string; timestamp: string }) => {
        setTypingUsers(prev => prev.filter(n => n !== data.sender))
        clearTimeout(typingTimers.current[data.sender])
        const plain = keyRef.current
          ? (await decryptText(keyRef.current, data.text)) ?? '[encrypted message]'
          : data.text
        setMessages(prev => [
          ...prev,
          {
            id: data.id,
            type: 'chat',
            text: escapeHtml(plain.slice(0, MAX_LEN)),
            sender: data.sender,
            timestamp: data.timestamp,
            createdAt: Date.now(),
            isOwn: false,
          },
        ])
      })

      socket.on('file', async (data: {
        id: string; fileName: string; fileType: string
        fileData: string; fileSize: number; sender: string; timestamp: string
      }) => {
        const k = keyRef.current
        const fileName = k ? (await decryptText(k, data.fileName)) ?? data.fileName : data.fileName
        const fileData = k ? (await decryptText(k, data.fileData)) ?? data.fileData : data.fileData
        setMessages(prev => [
          ...prev,
          {
            id: data.id,
            type: 'file',
            text: fileName,
            fileName,
            fileType: data.fileType,
            fileData,
            fileSize: data.fileSize,
            sender: data.sender,
            timestamp: data.timestamp,
            createdAt: Date.now(),
            isOwn: false,
          },
        ])
      })

      socket.on('typing', (data: { name: string; id: string }) => {
        setTypingUsers(prev => prev.includes(data.name) ? prev : [...prev, data.name])
        clearTimeout(typingTimers.current[data.id])
        typingTimers.current[data.id] = setTimeout(() => {
          setTypingUsers(prev => prev.filter(n => n !== data.name))
        }, 2500)
      })
    })

    return () => {
      cancelled = true
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [userName, roomId, password])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim().slice(0, MAX_LEN)
    if (!trimmed || !socketRef.current || !keyRef.current) return

    const msgTs = ts()
    setMessages(prev => [
      ...prev,
      { id: uid(), type: 'chat', text: escapeHtml(trimmed), sender: userName, timestamp: msgTs, createdAt: Date.now(), isOwn: true },
    ])
    const encrypted = await encryptText(keyRef.current, trimmed)
    socketRef.current.emit('message', { text: encrypted, timestamp: msgTs })
  }, [userName])

  const sendFile = useCallback(async (file: File) => {
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      alert('File too large — maximum size is 5MB. For images, try compressing first.')
      return
    }

    const doSend = async (fileData: string, fileType: string, fileSize: number) => {
      const msgTs = ts()
      const msgId = uid()
      setMessages(prev => [
        ...prev,
        {
          id: msgId, type: 'file', text: file.name,
          fileName: file.name, fileType,
          fileData, fileSize,
          sender: userName, timestamp: msgTs, createdAt: Date.now(), isOwn: true,
        },
      ])
      const k = keyRef.current
      const encFileName = k ? await encryptText(k, file.name) : file.name
      const encFileData = k ? await encryptText(k, fileData) : fileData
      socketRef.current?.emit('file', {
        id: msgId, fileName: encFileName, fileType,
        fileData: encFileData, fileSize, timestamp: msgTs,
      })
    }

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
        doSend(compressed, 'image/jpeg', Math.round(compressed.length * 0.75))
      }
      img.onerror = () => {
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

  return { messages, onlineUsers, typingUsers, connected, error, isCreator, e2eeReady, sendMessage, sendFile, emitTyping }
}
