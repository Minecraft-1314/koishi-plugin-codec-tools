import { Context, Schema } from 'koishi'
import { decodeBase64, decodeUnicode, decodeUrl, encodeBase64, encodeUnicode, encodeUrl, validateInput } from './utils'

export const name = 'codec-tools'

export interface Config {
  maxInputLength?: number
}

export const Config: Schema<Config> = Schema.object({
  maxInputLength: Schema.natural()
    .default(10000)
    .description('最大输入长度（字符数）'),
})

function run(error: string, fn: () => string): string {
  try {
    return fn()
  } catch {
    return error
  }
}

export function apply(ctx: Context, config: Config) {
  const maxLen = config.maxInputLength ?? 10000

  ctx.command('url-encode <text:text>', 'URL 编码').action((_, text) => {
    const err = validateInput(text, maxLen)
    if (err) return err
    return encodeUrl(text)
  })

  ctx.command('url-decode <text:text>', 'URL 解码').action((_, text) => {
    const err = validateInput(text, maxLen)
    if (err) return err
    return run('URL 解码失败：输入格式不正确', () => decodeUrl(text))
  })

  ctx.command('base64-encode <text:text>', 'Base64 编码').action((_, text) => {
    const err = validateInput(text, maxLen)
    if (err) return err
    return encodeBase64(text)
  })

  ctx.command('base64-decode <text:text>', 'Base64 解码').action((_, text) => {
    const err = validateInput(text, maxLen)
    if (err) return err
    return run('Base64 解码失败：输入不是有效的 Base64 编码', () => {
      const result = decodeBase64(text)
      if (result.length === 0) throw new Error('empty result')
      return result
    })
  })

  ctx.command('unicode-encode <text:text>', 'Unicode 编码').action((_, text) => {
    const err = validateInput(text, maxLen)
    if (err) return err
    return encodeUnicode(text)
  })

  ctx.command('unicode-decode <text:text>', 'Unicode 解码').action((_, text) => {
    const err = validateInput(text, maxLen)
    if (err) return err
    return run('Unicode 解码失败：输入包含无效的转义序列', () => {
      const result = decodeUnicode(text)
      if (result.length === 0) throw new Error('empty result')
      return result
    })
  })
}