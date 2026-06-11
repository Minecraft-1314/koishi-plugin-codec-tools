import { Context, Schema } from 'koishi'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parse } from 'yaml'

export const name = 'codec-tools'
export const using = ['i18n'] as const

export interface Config {
  maxInputLength?: number
}
export const Config: Schema<Config> = Schema.object({
  maxInputLength: Schema.natural()
    .default(10000)
    .description('最大输入长度（字符数）'),
})

function validateInput(text: string, maxLen: number): string | null {
  if (text.length === 0) return '输入不能为空'
  if (text.length > maxLen) return `输入过长，最大允许 ${maxLen} 个字符`
  return null
}

function encodeUrl(text: string): string {
  return encodeURIComponent(text)
}

function decodeUrl(text: string): string {
  return decodeURIComponent(text)
}

function encodeBase64(text: string): string {
  return Buffer.from(text, 'utf-8').toString('base64')
}

function decodeBase64(text: string): string {
  return Buffer.from(text, 'base64').toString('utf-8')
}

function encodeUnicode(text: string): string {
  let result = ''
  for (const char of text) {
    const cp = char.codePointAt(0)!
    if (cp > 0xffff) {
      result += '\\u{' + cp.toString(16) + '}'
    } else {
      result += '\\u' + cp.toString(16).padStart(4, '0')
    }
  }
  return result
}

function decodeUnicode(text: string): string {
  return text.replace(
    /\\u\{([0-9a-fA-F]{1,6})\}|\\u([0-9a-fA-F]{4})/g,
    (_, brace, fixed) => String.fromCodePoint(parseInt(brace || fixed, 16)),
  )
}

export function apply(ctx: Context, config: Config) {
  const maxLen = config.maxInputLength ?? 10000

  const zhCNPath = join(__dirname, './locales/zh-CN.yml')
  const zhCNContent = readFileSync(zhCNPath, 'utf8')
  const zhCN = parse(zhCNContent)
  ctx.i18n.define('zh-CN', zhCN)

  ctx.command('url-encode <text:text>').action((_, text) => {
    const err = validateInput(text, maxLen)
    if (err) return err
    try {
      return encodeUrl(text)
    } catch {
      return 'URL 编码失败：输入包含无效字符'
    }
  })

  ctx.command('url-decode <text:text>').action((_, text) => {
    const err = validateInput(text, maxLen)
    if (err) return err
    try {
      return decodeUrl(text)
    } catch {
      return 'URL 解码失败：输入格式不正确'
    }
  })

  ctx.command('base64-encode <text:text>').action((_, text) => {
    const err = validateInput(text, maxLen)
    if (err) return err
    return encodeBase64(text)
  })

  ctx.command('base64-decode <text:text>').action((_, text) => {
    const err = validateInput(text, maxLen)
    if (err) return err
    try {
      const result = decodeBase64(text)
      if (result.length === 0) return 'Base64 解码结果为空'
      return result
    } catch {
      return 'Base64 解码失败：输入格式不正确'
    }
  })

  ctx.command('unicode-encode <text:text>').action((_, text) => {
    const err = validateInput(text, maxLen)
    if (err) return err
    return encodeUnicode(text)
  })

  ctx.command('unicode-decode <text:text>').action((_, text) => {
    const err = validateInput(text, maxLen)
    if (err) return err
    try {
      const result = decodeUnicode(text)
      if (result.length === 0) return 'Unicode 解码结果为空'
      return result
    } catch {
      return 'Unicode 解码失败：输入格式不正确'
    }
  })
}
