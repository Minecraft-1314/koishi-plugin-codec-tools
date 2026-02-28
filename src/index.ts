import { Context, Schema } from 'koishi';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

export const name = 'codec-tools';
export const using = ['i18n'] as const;

export interface Config {}
export const Config: Schema<Config> = Schema.object({}).i18n({ 'zh-CN': {} });

export function apply(ctx: Context, config: Config) {
    const zhCNPath = path.join(__dirname, './locales/zh-CN.yml');
    const zhCNContent = fs.readFileSync(zhCNPath, 'utf8');
    const zhCN = yaml.parse(zhCNContent);
    ctx.i18n.define('zh-CN', zhCN);

    ctx.command('url-encode <text:text>')
        .action((_, text) => encodeURIComponent(text));

    ctx.command('url-decode <text:text>')
        .action((_, text) => decodeURIComponent(text));

    ctx.command('base64-encode <text:text>')
        .action((_, text) => Buffer.from(text).toString('base64'));

    ctx.command('base64-decode <text:text>')
        .action((_, text) => Buffer.from(text, 'base64').toString());

    ctx.command('unicode-encode <text:text>')
        .action((_, text) => 
            text.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('')
        );

    ctx.command('unicode-decode <text:text>')
        .action((_, text) => 
            text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        );
}