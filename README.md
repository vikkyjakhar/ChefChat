<div align="center">

<!-- Animated banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=16a34a&height=200&section=header&text=ChefChat&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Real-time%20private%20chat%2C%20built%20for%20everyone&descAlignY=60&descColor=dcfce7" width="100%"/>

<br/>

![Made with React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br/>

> **Private rooms · Real-time messaging · File sharing · Dark mode · XSS safe**

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=22&pause=1000&color=16A34A&center=true&vCenter=true&width=600&lines=Real-time+chat+across+any+network;Private+rooms+with+unique+IDs;Send+images+%26+files+instantly;Green+%26+White+or+Dark+theme;Typing+indicators+%26+online+users" alt="Typing SVG" />

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Private Rooms** | Each room gets a unique 8-char ID — share it only with who you want |
| ⚡ **Real-time Messaging** | Powered by Socket.io WebSockets — zero delay, no refresh needed |
| 📁 **File & Image Sharing** | Send images, PDFs, ZIPs and more — up to 5MB per file |
| 🌍 **Cross-network** | Works between any two people anywhere in the world |
| 👥 **Online Users List** | Live sidebar showing everyone currently in the room |
| ⌨️ **Typing Indicators** | See when someone is typing — debounced, not spammy |
| 🕐 **Timestamps** | Every message shows HH:MM |
| 🌗 **Theme Toggle** | Animated sun/moon slider — Green & White or Dark theme |
| 💾 **Theme Persistence** | Your theme choice is remembered across sessions via localStorage |
| 🛡️ **XSS Safe** | All user input is sanitized before rendering — no script injection |
| 📱 **Responsive** | Works on mobile — sidebar collapses into a hamburger drawer |
| 🔄 **Auto-reconnect** | Dropped connection? Socket.io reconnects automatically |

---

## 🚀 Why ChefChat?

- **No accounts needed** — just enter a name and a room ID, you're in
- **Truly private** — rooms are isolated; no one outside your room ID can see your messages
- **No ads, no tracking** — clean, distraction-free chat
- **Fast** — WebSocket connection means messages arrive in milliseconds
- **Images render inline** — no need to open a link, photos display right in the chat
- **Open source** — fork it, self-host it, make it yours

---

## 🛠️ Tech Stack

```
Frontend          Backend
─────────         ─────────
React 19          Node.js 18+
Vite 8            Express
Tailwind v4       Socket.io 4.8
TypeScript 5      In-memory rooms
socket.io-client  CORS enabled
```

---

## ⚙️ Setup

### Frontend (Figma Make / Vite)
```bash
pnpm install
pnpm dev
```

### Backend Server
```bash
npm install
node server.js
# → ChefChat server on port 3001
```

Set `VITE_SOCKET_URL` to your server URL (e.g. from Render or ngrok).

---

## 🌐 Deployment

| Service | Type | Notes |
|---|---|---|
| [Figma Make](https://figma.com) | Frontend | Auto-deployed |
| [Render](https://render.com) | Backend | Free tier, sleeps after 15min idle |
| [ngrok](https://ngrok.com) | Backend (local) | Great for testing |

---

## 📸 Screenshots

| Light Mode | Dark Mode |
|---|---|
| Green & White theme | Midnight dark theme |

---

## 🔒 Security

- All messages escaped with `escapeHtml()` before DOM insertion
- Empty/whitespace usernames and messages rejected
- Username capped at 20 chars, messages at 500 chars
- Room IDs isolate conversations completely

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=16a34a&height=100&section=footer" width="100%"/>

**Made with ❤️ using React + Socket.io**

</div>
