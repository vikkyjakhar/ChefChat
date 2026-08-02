const enc = new TextEncoder()
const dec = new TextDecoder()

/**
 * Derives a 256-bit AES-GCM key from the room ID and optional password.
 * All participants in the same room derive the same key, so the server
 * never has access to plaintext messages.
 */
export async function deriveRoomKey(roomId: string, password: string): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(roomId + ':' + password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('chefchat:' + roomId),
      iterations: 50_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

/** Encrypts a UTF-8 string. Returns a base64 string: 12-byte IV + ciphertext. */
export async function encryptText(key: CryptoKey, plaintext: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext),
  )
  const buf = new Uint8Array(12 + ciphertext.byteLength)
  buf.set(iv)
  buf.set(new Uint8Array(ciphertext), 12)
  let binary = ''
  for (let i = 0; i < buf.byteLength; i++) binary += String.fromCharCode(buf[i])
  return btoa(binary)
}

/** Decrypts a base64 string produced by encryptText. Returns null on failure. */
export async function decryptText(key: CryptoKey, encoded: string): Promise<string | null> {
  try {
    const buf = Uint8Array.from(atob(encoded), c => c.charCodeAt(0))
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: buf.slice(0, 12) },
      key,
      buf.slice(12),
    )
    return dec.decode(plaintext)
  } catch {
    return null
  }
}
