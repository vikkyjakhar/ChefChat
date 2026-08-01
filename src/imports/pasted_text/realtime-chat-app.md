## ROLE

You are an expert full-stack JavaScript developer. Build a fully functional, production-quality, real-time chat application. Do not scaffold placeholders — every feature listed below must be working code, not TODOs.

## OBJECTIVE

A real-time, multi-user chat app using Socket.io, with a **Green & White light theme** as default and a fully working **Dark theme** toggle. Clean, modern, non-templated UI — not a bare Bootstrap-looking chat box.

## TECH STACK (mandatory unless stated otherwise)

- **Backend:** Node.js + Express + Socket.io
- **Frontend:** Vanilla HTML / CSS / JavaScript (no framework, no build step)
  - *Alternative:* If you prefer component structure, swap to React + Vite, but keep Socket.io client logic identical.
- **Persistence:** In-memory only for v1 (messages/users reset on server restart). Note MongoDB/SQLite as a "Phase 2" comment in code — do not implement it now.

## CORE FUNCTIONAL REQUIREMENTS

1. **Join screen** — user enters a display name before entering the chat (no login/auth needed).
2. **Real-time messaging** — broadcast to all connected users via Socket.io.
3. **Online users list** — live-updating sidebar, updates instantly on join/leave.
4. **Typing indicator** — "Alex is typing…", debounced (don't emit on every keystroke), auto-clears after ~2s of inactivity.
5. **System messages** — "Alex joined the chat" / "Alex left the chat", visually distinct from regular messages.
6. **Timestamps** — every message shows HH:MM.
7. **Auto-scroll** — scrolls to latest message, but does NOT force-scroll if the user has manually scrolled up to read history.
8. **Message bubbles** — sent messages (yours) right-aligned and colored; received messages left-aligned with sender name + avatar initial.
9. **Input sanitization** — escape all user input before rendering to the DOM. This is non-negotiable; no raw `innerHTML` of user text (XSS prevention).
10. **Send controls** — Enter key sends message, Shift+Enter for newline, plus a visible send button.
11. **Responsive** — works cleanly on mobile (sidebar becomes a collapsible drawer) and desktop.
12. **Theme toggle** — switch between Green/White and Dark themes, persisted across reloads via `localStorage`.

## DESIGN SYSTEM

Use CSS custom properties so the whole UI reacts to a single `data-theme` attribute swap on `<html>`.

### Light Theme — "Green & White" (default)

```css
:root,
[data-theme="light"] {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F1F8F4;   /* faint green tint for panels/sidebar */
  --bg-tertiary: #E8F5E9;    /* hover states */
  --border: #D1E7D6;

  --accent: #16A34A;         /* primary green */
  --accent-hover: #15803D;
  --accent-soft: #DCFCE7;    /* system message bg */

  --text-primary: #14532D;   /* deep green-black for headers */
  --text-secondary: #4B5563;
  --text-on-accent: #FFFFFF;

  --bubble-sent-bg: linear-gradient(135deg, #22C55E, #16A34A);
  --bubble-sent-text: #FFFFFF;
  --bubble-received-bg: #F3F4F6;
  --bubble-received-text: #1F2937;

  --shadow: 0 1px 3px rgba(20, 83, 45, 0.08);
}
```

### Dark Theme

```css
[data-theme="dark"] {
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-tertiary: #273449;
  --border: #334155;

  --accent: #4ADE80;         /* brighter green pops on dark bg */
  --accent-hover: #86EFAC;
  --accent-soft: #14532D;

  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-on-accent: #052E14;

  --bubble-sent-bg: linear-gradient(135deg, #16A34A, #15803D);
  --bubble-sent-text: #F0FDF4;
  --bubble-received-bg: #1E293B;
  --bubble-received-text: #E5E7EB;

  --shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
```

### Theme Toggle Behavior

- A single icon button in the header (sun/moon or leaf/moon icon).
- On first load with no stored preference, respect `prefers-color-scheme: dark`.
- On toggle, set `document.documentElement.setAttribute('data-theme', ...)` and save to `localStorage`.
- Transition colors with a short `transition: background-color 0.2s ease, color 0.2s ease` — no jarring flash.

## UI LAYOUT

- **Header:** app name/logo, live online-user count, theme toggle button.
- **Sidebar** (desktop: fixed left panel; mobile: collapsible drawer via hamburger icon): online users list, each with a colored initial-avatar.
- **Main panel:** scrollable message list, input bar pinned to the bottom with textarea + send button.
- **Typography:** a clean system font stack (`-apple-system, "Segoe UI", Roboto, sans-serif`) — no default browser-serif look.
- Rounded bubble corners (14–18px), subtle `box-shadow` using `--shadow`, generous padding — avoid a cramped, dense feel.

## FILE STRUCTURE

```
chat-app/
├── package.json
├── server.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── client.js
└── README.md
```

## SECURITY & EDGE CASES (must handle)

- Escape/sanitize every piece of user-submitted text before it touches the DOM.
- Reject empty or whitespace-only usernames and messages.
- Cap message length (e.g., 500 characters) and username length (e.g., 20 characters), enforced both client- and server-side.
- On disconnect (including tab close / network drop), remove the user from the online list and broadcast a "left" system message.
- Debounce the typing-indicator emit — don't fire a socket event per keystroke.
- If the socket disconnects unexpectedly, show a small "Reconnecting…" banner and attempt to reconnect (Socket.io's built-in reconnection is fine — just surface it in the UI).

## ACCEPTANCE CHECKLIST

- [ ] Two browser tabs can message each other in real time with no page reload
- [ ] Theme toggle switches instantly and survives a page refresh
- [ ] Typing indicator appears and disappears correctly, isn't spammy on the network tab
- [ ] Mobile viewport (375px wide) has no horizontal scroll and sidebar collapses properly
- [ ] Pasting `<script>alert(1)</script>` into the chat renders as plain text, not executed
- [ ] Join/leave system messages appear for every connect/disconnect

## DELIVERABLES

Complete, runnable code for every file in the structure above, with brief inline comments on non-obvious logic (Socket.io event wiring, sanitization, theme persistence). Include a `README.md` with setup steps: `npm install`, `npm start`, and which port to open in the browser.
