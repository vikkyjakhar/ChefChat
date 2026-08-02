<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=240&section=header&text=ChefChat&fontSize=90&fontColor=fff&animation=twinkling&fontAlignY=38&desc=🔐%20End-to-End%20Encrypted%20·%20Real-time%20·%20Private%20Rooms&descAlignY=62&descSize=20&descColor=dcfce7" width="100%"/>

<br/>

<a href="#"><img src="https://img.shields.io/badge/🚀%20Released-v1.0-brightgreen?style=for-the-badge&labelColor=052e14" /></a>
<a href="#"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=0d1117" /></a>
<a href="#"><img src="https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white&labelColor=0d1117" /></a>
<a href="#"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white&labelColor=0d1117" /></a>
<a href="#"><img src="https://img.shields.io/badge/AES--256--GCM-E2EE-16a34a?style=for-the-badge&logo=letsencrypt&logoColor=white&labelColor=052e14" /></a>
<a href="#"><img src="https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge&labelColor=052e14" /></a>

<br/><br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&duration=2800&pause=800&color=22C55E&center=true&vCenter=true&width=700&lines=🔐+End-to-End+Encrypted+Chat;🚀+Real-time+across+any+network;🔒+Password-protected+private+rooms;📁+Send+images+%26+files+up+to+5MB;👑+Room+creator+%26+admin+badges;📋+One-click+invite+links;⏱️+Message+expiry+controls;🌗+Animated+dark+%2F+light+theme" alt="ChefChat features" />

<br/><br/>

> ### 🎉 ChefChat v1.0 is officially released!
> **Private, encrypted, real-time chat — no accounts, no ads, no tracking.**

<br/>

</div>

---

<div align="center">

## 🗺️ Table of Contents

[Features](#-features) · [E2EE](#-end-to-end-encryption) · [Why ChefChat](#-why-chefchat) · [Tech Stack](#-tech-stack) · [Setup](#-setup) · [Deployment](#-deployment) · [Security](#-security)

</div>

---

## 🚀 What's New in v1.0

<table>
<tr>
<td>

**🔐 End-to-End Encryption**
AES-256-GCM with PBKDF2 key derivation. The server **never** sees your messages.

</td>
<td>

**🔒 Password-Protected Rooms**
Lock your room — only people with the password can join.

</td>
</tr>
<tr>
<td>

**👑 Room Creator Badges**
Crown icon marks who created the room, in both header and sidebar.

</td>
<td>

**👥 Live Participant Count**
`N/100` updates in real time as people join and leave.

</td>
</tr>
<tr>
<td>

**📋 Invite Links**
One click copies a URL with the room code pre-filled.

</td>
<td>

**⏱️ Message Expiry**
Show last 1 hour, 24 hours, or everything until room closes.

</td>
</tr>
<tr>
<td>

**🟢 Presence Avatars**
Join/leave toasts show a colored avatar + green/grey status dot.

</td>
<td>

**🛡️ E2EE Badge**
Live shield indicator in the header — turns green when encryption is active.

</td>
</tr>
</table>

---

## ✨ Features

| Feature | Description |
|:---:|---|
| 🛡️ | **End-to-End Encryption** — AES-256-GCM. Server only ever sees ciphertext |
| 🔐 | **Private Rooms** — Unique 8-character room codes, never repeated |
| 🔒 | **Room Passwords** — Optional lock; validated server-side before entry |
| ⚡ | **Real-time Messaging** — Socket.io WebSockets, zero delay |
| 📁 | **File & Image Sharing** — Images, PDFs, ZIPs up to 5MB; images auto-compressed |
| 👑 | **Creator Badges** — Crown for the room creator in header and sidebar |
| 👥 | **Live Participant Count** — Real-time `N/100` counter |
| 📋 | **Invite Links** — Copy a direct join URL with room code pre-filled |
| ⏱️ | **Message Expiry** — Last 1h, 24h, or until room closes |
| 🌍 | **Cross-network** — Works between any two people anywhere in the world |
| 🟢 | **Presence Avatars** — Colored avatar + status dot on join/leave |
| ⌨️ | **Typing Indicators** — Debounced, shows who's typing |
| 🕐 | **Timestamps** — Every message shows HH:MM |
| 🌗 | **Animated Theme Toggle** — Sun/moon slider, Green & White or Dark |
| 💾 | **Theme Persistence** — Saved via localStorage |
| 🛡️ | **XSS Safe** — All input escaped before rendering |
| 📱 | **Responsive** — Sidebar collapses to hamburger on mobile |
| 🔄 | **Auto-reconnect** — Dropped? Socket.io reconnects automatically |

---

## 🔐 End-to-End Encryption

> No external library. 100% native **Web Crypto API**.

```
  You type a message
        │
        ▼
  PBKDF2 key derivation
  (Room Code + Password, 50,000 iterations, SHA-256)
        │
        ▼
  256-bit AES-GCM key  +  Random 12-byte IV
        │
        ▼
  ┌─────────────────────────────────┐
  │   Encrypted ciphertext (base64) │  ◄── only this leaves your device
  └─────────────────────────────────┘
        │
        ▼
  Socket.io  ──►  Server  ──►  Other clients
                    │
               (sees nothing)
```

| Property | Value |
|---|---|
| Algorithm | AES-256-GCM (authenticated encryption) |
| Key derivation | PBKDF2 — SHA-256, 50,000 iterations |
| IV | Random 12 bytes per message |
| What server sees | Base64 ciphertext only |
| Decryption failure | Shows `[encrypted message]` gracefully |
| Library required | None — Web Crypto API is built into all browsers |

**With a room password:** key = `RoomCode + Password` → stronger, double-gated access  
**Without a password:** key = `RoomCode` alone → anyone with the code can decrypt (expected)

---

## 🚀 Why ChefChat?

```
  ✅  No account required        ✅  Encrypted by default
  ✅  No ads, no tracking         ✅  Works across any network
  ✅  Images render inline        ✅  Up to 100 people per room
  ✅  Invite anyone with a link   ✅  Open source — fork & self-host
```

---

## 🛠️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js_18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io_4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)

</div>

```
Frontend                         Backend
──────────────────────────────   ──────────────────────────────
React 19 + TypeScript 5          Node.js 18+
Vite 8                           Express
Tailwind CSS v4                  Socket.io 4.8
socket.io-client 4.8             In-memory rooms + passwords
Web Crypto API (built-in)        maxHttpBufferSize: 7MB
```

---

## ⚙️ Setup

### 1. Frontend

```bash
pnpm install
pnpm dev
# → http://localhost:5173
```

Add your server URL as an environment variable:
```bash
VITE_SOCKET_URL=https://your-server.onrender.com
```

### 2. Backend Server

```bash
npm install express socket.io cors
node server.js
# → ChefChat server on http://localhost:3001
```

> Reference server code is in [`src/server/server-readme.ts`](src/server/server-readme.ts)

---

## 🌐 Deployment

| Service | Purpose | Notes |
|---|---|---|
| [Figma Make](https://figma.com/make) | Frontend | Auto-deploys on save |
| [Render](https://render.com) | Backend | Free tier — Build: `npm install` · Start: `node server.js` |
| [ngrok](https://ngrok.com) | Local testing | `npx ngrok http 3001` |

---

## 📋 Room Guide

```
  CREATE A ROOM                      JOIN A ROOM
  ─────────────────────────────      ─────────────────────────────
  ① Auto-generated room code         ① Enter room code manually
  ② Set optional password lock       ② Enter password if required
  ③ Copy code or share invite link   ③ Or open an invite link
  ④ Up to 100 participants           ④ Wrong password → error shown
  ⑤ Crown badge marks you creator   ⑤ Join avatar appears in chat
```

---

## 🔒 Security

| Layer | Protection |
|---|---|
| **Messages** | AES-256-GCM end-to-end encryption — server sees only ciphertext |
| **Files** | File names and data also encrypted end-to-end |
| **Key derivation** | PBKDF2, 50,000 iterations, SHA-256 |
| **Room access** | Server-side password validation before joining |
| **XSS** | `escapeHtml()` on all rendered user content |
| **Input limits** | Usernames ≤ 20 chars · Messages ≤ 500 chars · Files ≤ 5MB |
| **Isolation** | Socket.io rooms — zero cross-room leakage |

---

<div align="center">

<br/>

**⭐ If you found ChefChat useful, give it a star!**

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=140&section=footer&text=ChefChat%20v1.0%20—%20Released&fontSize=32&fontColor=ffffff&animation=twinkling&fontAlignY=65" width="100%"/>

</div>
