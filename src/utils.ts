export function validateInput(text: string | undefined, maxLen: number): string | null {
  if (!text || text.length === 0) return '输入不能为空'
  if (text.length > maxLen) return `输入过长，最大允许 ${maxLen} 个字符`
  return null
}

export function encodeUrl(text: string): string {
  return encodeURIComponent(text)
}

export function decodeUrl(text: string): string {
  return decodeURIComponent(text)
}

export function encodeBase64(text: string): string {
  return Buffer.from(text, 'utf-8').toString('base64')
}

const BASE64_PATTERN = /^[A-Za-z0-9+/_-]*={0,2}$/
const UTF8_DECODER = new TextDecoder('utf-8', { fatal: true })

export function decodeBase64(text: string): string {
  const normalized = text.replace(/\s+/g, '')
  if (normalized.length % 4 === 1 || !BASE64_PATTERN.test(normalized)) {
    throw new Error('invalid base64 input')
  }
  const source = normalized.replace(/-/g, '+').replace(/_/g, '/')
  return UTF8_DECODER.decode(Buffer.from(source, 'base64'))
}

export function encodeUnicode(text: string): string {
  const parts: string[] = []
  for (const char of text) {
    const cp = char.codePointAt(0)!
    parts.push(cp > 0xffff ? `\\u{${cp.toString(16)}}` : `\\u${cp.toString(16).padStart(4, '0')}`)
  }
  return parts.join('')
}

const UNICODE_ESCAPE = /\\u\{([0-9a-fA-F]{1,6})\}|\\u([0-9a-fA-F]{4})/g

export function decodeUnicode(text: string): string {
  return text.replace(UNICODE_ESCAPE, (match, brace, fixed) => {
    const cp = parseInt(brace || fixed, 16)
    if (cp > 0x10ffff) throw new Error('invalid unicode code point')
    return String.fromCodePoint(cp)
  })
}