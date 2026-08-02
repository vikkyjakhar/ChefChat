<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=16a34a&height=220&section=header&text=ChefChat&fontSize=90&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=End-to-End%20Encrypted%20%C2%B7%20Real-time%20%C2%B7%20Private%20Rooms&descAlignY=60&descColor=dcfce7" width="100%"/>

<br/>

![Release](https://img.shields.io/badge/🚀%20Released-v1.0-16a34a?style=for-the-badge)
![Made with React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br/>

> ### 🎉 ChefChat is officially released!
> Private, encrypted, real-time chat — no accounts, no ads, no tracking.

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=22&pause=1000&color=16A34A&center=true&vCenter=true&width=700&lines=🔐+End-to-End+Encrypted+by+default;🚀+Real-time+across+any+network;🔒+Password-protected+private+rooms;📁+Send+images+%26+files+up+to+5MB;👑+Room+creator+%26+admin+badges;⏱️+Message+expiry+controls;🌗+Animated+dark+%2F+light+theme;📋+One-click+invite+links" alt="Typing SVG" />

<br/>

</div>

---

## 🚀 What's New in v1.0

ChefChat has officially launched with a full-featured, production-ready release. Here's everything that shipped:

- 🔐 **End-to-End Encryption** — AES-256-GCM, keys derived with PBKDF2. The server **never** sees your messages
- 🔒 **Password-Protected Rooms** — creators can lock rooms with a password; wrong password = no entry
- 👑 **Room Creator Badges** — crown icon identifies who created the room, in header and sidebar
- 👥 **Live Participant Count** — `N/100 participants` updates in real time as people join and leave
- 📋 **Invite Links** — one click copies a shareable URL with the room code pre-filled
- ⏱️ **Message Expiry** — choose to show messages from the last 1 hour, 24 hours, or until room closes
- 🟢 **Join / Leave Avatars** — presence notifications show a colored avatar + green/grey status dot
- 🔏 **Locked Room Indicator** — padlock badge in header when room is password protected

---

## ✨ Full Feature List

| Feature | Description |
|---|---|
| 🛡️ **End-to-End Encryption** | AES-256-GCM encryption with PBKDF2 key derivation. Server only sees ciphertext |
| 🔐 **Private Rooms** | Unique 8-character room codes — share only with who you want |
| 🔒 **Room Passwords** | Optional password protection; validated server-side before entry |
| ⚡ **Real-time Messaging** | Socket.io WebSockets — zero delay, no refresh needed |
| 📁 **File & Image Sharing** | Send images, PDFs, ZIPs and more — up to 5MB, images auto-compressed |
| 👑 **Creator Badges** | The room creator gets a crown in the header and sidebar |
| 👥 **Live Participant Count** | Real-time `N/100` counter in the header |
| 📋 **Invite Links** | Copy a direct join URL with the room code pre-filled |
| ⏱️ **Message Expiry** | Filter to last 1 hour, 24 hours, or until room closes |
| 🌍 **Cross-network** | Works between any two people anywhere in the world |
| 🟢 **Presence Avatars** | Join/leave toasts show colored avatar initials + green/grey dot |
| ⌨️ **Typing Indicators** | Debounced — shows who's typing without being spammy |
| 🕐 **Timestamps** | Every message shows HH:MM |
| 🌗 **Animated Theme Toggle** | Sun/moon slider — Green & White or Dark theme |
| 💾 **Theme Persistence** | Theme remembered across sessions via localStorage |
| 🛡️ **XSS Safe** | All user input escaped before rendering — no script injection |
| 📱 **Responsive** | Mobile-friendly — sidebar collapses into a hamburger drawer |
| 🔄 **Auto-reconnect** | Dropped connection? Socket.io reconnects automatically |

---

## 🔐 End-to-End Encryption — How It Works

ChefChat uses the browser's native **Web Crypto API** — no external library required.

```
Room Code + Password
        ↓
   PBKDF2 (50,000 iterations, SHA-256)
        ↓
   256-bit AES-GCM Key
        ↓
   Random 12-byte IV per message
        ↓
   Encrypted ciphertext  →  Socket.io  →  Server  →  Other clients
                                              ↑
                                     Server only sees this
```

- **The server never has the plaintext** — every message, file name, and file payload is encrypted before leaving your device
- **Without a password**: key is derived from the Room Code alone — anyone with the code can decrypt (expected for open rooms)
- **With a password**: key = Room Code + Password — significantly stronger
- **Decryption failure** displays `[encrypted message]` gracefully instead of crashing

---

## 🚀 Why ChefChat?

- **No accounts needed** — enter a name and room code, you're in
- **Encrypted by default** — E2EE on every single message, no opt-in required
- **Truly private** — rooms are isolated; no one outside your room can see your messages
- **No ads, no tracking** — clean, distraction-free chat
- **Fast** — WebSocket connection means messages arrive in milliseconds
- **Images render inline** — photos display right in the chat, no link to click
- **Up to 100 participants** per room
- **Open source** — fork it, self-host it, make it yours

---

## 🛠️ Tech Stack

```
Frontend                    Backend
─────────────────────────   ─────────────────────────
React 19                    Node.js 18+
Vite 8                      Express
Tailwind CSS v4             Socket.io 4.8
TypeScript 5                In-memory rooms + passwords
socket.io-client 4.8        CORS enabled
Web Crypto API (built-in)   maxHttpBufferSize: 7MB
```

---

## ⚙️ Setup

### Frontend (Figma Make / Vite)
```bash
pnpm install
pnpm dev
```

Set `VITE_SOCKET_URL` in your environment to point at your backend server.

### Backend Server
```bash
npm install express socket.io cors
node server.js
# → ChefChat server running on port 3001
```

> **server.js** handles: room creation, password validation, message relay, typing indicators, file transfer, presence events, and room creator tracking. Reference code is in `src/server/server-readme.ts`.

---

## 🌐 Deployment

| Service | Type | Notes |
|---|---|---|
| [Figma Make](https://figma.com/make) | Frontend | Auto-deployed on save |
| [Render](https://render.com) | Backend | Free tier · Start command: `node server.js` |
| [ngrok](https://ngrok.com) | Backend (local testing) | `npx ngrok http 3001` |

**Render environment:**
- Build Command: `npm install`
- Start Command: `node server.js`
- No `package-lock.json` conflicts — uses npm directly

---

## 🔒 Security

| Layer | Protection |
|---|---|
| **Transport** | AES-256-GCM end-to-end encryption on all messages and files |
| **Key derivation** | PBKDF2, 50,000 iterations, SHA-256 |
| **Room access** | Server-side password validation before joining |
| **XSS** | `escapeHtml()` applied to all rendered user content |
| **Input limits** | Usernames ≤ 20 chars, messages ≤ 500 chars |
| **File limits** | 5MB max per file, images auto-compressed to 1200px JPEG |
| **Isolation** | Rooms are fully isolated — socket.io rooms prevent cross-room leakage |

---

## 📋 Room Features at a Glance

```
Create Room                    Join Room
───────────────────────        ───────────────────────
• Auto-generated room code     • Enter room code manually
• Optional password lock       • Enter password if required
• Copy code button             • Or open an invite link
• Up to 100 participants       • Wrong password → error shown
• Crown badge for creator      • Join avatar appears in chat
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=16a34a&height=120&section=footer&text=ChefChat%20v1.0%20%E2%80%94%20Released&fontSize=28&fontColor=ffffff&animation=fadeIn" width="100%"/>

**Built with React 19 · Socket.io · Web Crypto API · Tailwind CSS v4**

*No accounts. No tracking. Just chat.*

</div>
