"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.using = exports.name = void 0;
exports.apply = apply;
const koishi_1 = require("koishi");
const fs_1 = require("fs");
const path_1 = require("path");
const yaml_1 = require("yaml");
exports.name = 'codec-tools';
exports.using = ['i18n'];
exports.Config = koishi_1.Schema.object({
    maxInputLength: koishi_1.Schema.natural()
        .default(10000)
        .description('最大输入长度（字符数）'),
});
function validateInput(text, maxLen) {
    if (text.length === 0)
        return '输入不能为空';
    if (text.length > maxLen)
        return `输入过长，最大允许 ${maxLen} 个字符`;
    return null;
}
function encodeUrl(text) {
    return encodeURIComponent(text);
}
function decodeUrl(text) {
    return decodeURIComponent(text);
}
function encodeBase64(text) {
    return Buffer.from(text, 'utf-8').toString('base64');
}
function decodeBase64(text) {
    return Buffer.from(text, 'base64').toString('utf-8');
}
function encodeUnicode(text) {
    let result = '';
    for (const char of text) {
        const cp = char.codePointAt(0);
        if (cp > 0xffff) {
            result += '\\u{' + cp.toString(16) + '}';
        }
        else {
            result += '\\u' + cp.toString(16).padStart(4, '0');
        }
    }
    return result;
}
function decodeUnicode(text) {
    return text.replace(/\\u\{([0-9a-fA-F]{1,6})\}|\\u([0-9a-fA-F]{4})/g, (_, brace, fixed) => String.fromCodePoint(parseInt(brace || fixed, 16)));
}
function apply(ctx, config) {
    const maxLen = config.maxInputLength ?? 10000;
    const zhCNPath = (0, path_1.join)(__dirname, './locales/zh-CN.yml');
    const zhCNContent = (0, fs_1.readFileSync)(zhCNPath, 'utf8');
    const zhCN = (0, yaml_1.parse)(zhCNContent);
    ctx.i18n.define('zh-CN', zhCN);
    ctx.command('url-encode <text:text>').action((_, text) => {
        const err = validateInput(text, maxLen);
        if (err)
            return err;
        try {
            return encodeUrl(text);
        }
        catch {
            return 'URL 编码失败：输入包含无效字符';
        }
    });
    ctx.command('url-decode <text:text>').action((_, text) => {
        const err = validateInput(text, maxLen);
        if (err)
            return err;
        try {
            return decodeUrl(text);
        }
        catch {
            return 'URL 解码失败：输入格式不正确';
        }
    });
    ctx.command('base64-encode <text:text>').action((_, text) => {
        const err = validateInput(text, maxLen);
        if (err)
            return err;
        return encodeBase64(text);
    });
    ctx.command('base64-decode <text:text>').action((_, text) => {
        const err = validateInput(text, maxLen);
        if (err)
            return err;
        try {
            const result = decodeBase64(text);
            if (result.length === 0)
                return 'Base64 解码结果为空';
            return result;
        }
        catch {
            return 'Base64 解码失败：输入格式不正确';
        }
    });
    ctx.command('unicode-encode <text:text>').action((_, text) => {
        const err = validateInput(text, maxLen);
        if (err)
            return err;
        return encodeUnicode(text);
    });
    ctx.command('unicode-decode <text:text>').action((_, text) => {
        const err = validateInput(text, maxLen);
        if (err)
            return err;
        try {
            const result = decodeUnicode(text);
            if (result.length === 0)
                return 'Unicode 解码结果为空';
            return result;
        }
        catch {
            return 'Unicode 解码失败：输入格式不正确';
        }
    });
}
