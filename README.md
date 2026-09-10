<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=22,163,74,5,46,20&height=260&section=header&text=ChefChat&fontSize=90&fontColor=ffffff&animation=twinkling&fontAlignY=38&desc=Secure%20·%20Real-time%20·%20Private%20Rooms&descAlignY=62&descSize=20&descColor=dcfce7" width="100%"/>

<br/>

<a href="https://readme-typing-svg.demolab.com">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=26&pause=1000&color=22c55e&center=true&vCenter=true&width=550&lines=End-to-End+Encrypted;Real-time+Messaging;Password-Protected+Rooms;No+Tracking,+No+Ads;ChefChat+v1.0+Released! 🎉" alt="Typing SVG" />
</a>

<br/><br/>

<a href="#"><img src="https://img.shields.io/badge/🚀%20Released-v1.0-brightgreen?style=for-the-badge&labelColor=052e14" /></a>
<a href="#"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=0d1117" /></a>
<a href="#"><img src="https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white&labelColor=0d1117" /></a>
<a href="#"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white&labelColor=0d1117" /></a>
<a href="#"><img src="https://img.shields.io/badge/AES--256--GCM-E2EE-16a34a?style=for-the-badge&logo=letsencrypt&logoColor=white&labelColor=052e14" /></a>

<br/><br/>

![](https://img.shields.io/badge/🔐_End--to--End-Encrypted-16a34a?style=flat-square&labelColor=052e14)
![](https://img.shields.io/badge/⚡_Real--time-Messaging-16a34a?style=flat-square&labelColor=052e14)
![](https://img.shields.io/badge/🔒_Password-Protected_Rooms-16a34a?style=flat-square&labelColor=052e14)
![](https://img.shields.io/badge/📱_Android_APK_Ready-16a34a?style=flat-square&labelColor=052e14)

<br/>

> ### 🎉 ChefChat v1.0 is officially released and live!
> **Private, encrypted, real-time chat — no accounts, no ads, no tracking.**

<br/>

</div>

---

<div align="center">

## 🗺️ Table of Contents

[Features](#-features) · [E2EE](#-end-to-end-encryption) · [Why ChefChat](#-why-chefchat) · [Tech Stack](#-tech-stack) · [Setup](#-setup) · [Deployment](#-deployment) · [Security](#-security)

</div>

---

## 🚀 What's New in v1.0 Release

<table>
<tr>
<td>

**🔐 End-to-End Encryption**
AES-256-GCM with PBKDF2 key derivation. The server **never** sees your messages.

</td>
<td>

**📱 Native Android App**
Full Capacitor Android integration, custom app icons, and splash screens ready for your phone!

</td>
</tr>
<tr>
<td>

**🔒 Password-Protected Rooms**
Lock your room — only people with the password can join.

</td>
<td>

**👑 Room Creator Badges**
Crown icon marks who created the room, in both header and sidebar.

</td>
</tr>
<tr>
<td>

**👥 Live Participant Count**
`N/100` updates in real time as people join and leave.

</td>
<td>

**📋 Invite Links**
One click copies a URL with the room code pre-filled.

</td>
</tr>
<tr>
<td>

**⏱️ Message Expiry**
Show last 1 hour, 24 hours, or everything until room closes.

</td>
<td>

**🟢 Presence Avatars**
Join/leave toasts show a colored avatar + green/grey status dot.

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
![Capacitor](https://img.shields.io/badge/Capacitor-Android-119ADD?style=for-the-badge&logo=capacitor&logoColor=white)

</div>

```
Frontend                         Backend
──────────────────────────────   ──────────────────────────────
React 19 + TypeScript 5          Node.js 18+
Vite 8                           Express
Tailwind CSS v4                  Socket.io 4.8
socket.io-client 4.8             In-memory rooms + passwords
Capacitor 8 (Android Build)      Health Checks
```

---

## ⚙️ Setup

### 1. Frontend

```bash
npm install
npm run dev
# → http://localhost:5173
```

### 2. Backend Server

```bash
npm install express socket.io cors
node server.js
# → ChefChat server on http://localhost:3001
```

---

## 🌐 Deployment

| Service | Purpose | Notes |
|---|---|---|
| **Static Web Host** | Frontend | Build with `npm run build` |
| [Render](https://render.com) | Backend | Connect to GitHub — Build: `npm install` · Start: `node server.js` |
| **Android Studio** | Android App | Run `npx cap sync android` and build natively |

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

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=22,163,74,5,46,20&height=140&section=footer&text=ChefChat%20v1.0%20—%20Officially%20Released!&fontSize=32&fontColor=ffffff&animation=twinkling&fontAlignY=65" width="100%"/>

</div>
