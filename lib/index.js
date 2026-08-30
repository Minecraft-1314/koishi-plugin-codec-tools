"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.name = void 0;
exports.apply = apply;
const koishi_1 = require("koishi");
const utils_1 = require("./utils");
exports.name = 'codec-tools';
exports.Config = koishi_1.Schema.object({
    maxInputLength: koishi_1.Schema.natural()
        .default(10000)
        .description('最大输入长度（字符数）'),
});
function run(error, fn) {
    try {
        return fn();
    }
    catch {
        return error;
    }
}
function apply(ctx, config) {
    const maxLen = config.maxInputLength ?? 10000;
    ctx.command('url-encode <text:text>', 'URL 编码').action((_, text) => {
        const err = (0, utils_1.validateInput)(text, maxLen);
        if (err)
            return err;
        return (0, utils_1.encodeUrl)(text);
    });
    ctx.command('url-decode <text:text>', 'URL 解码').action((_, text) => {
        const err = (0, utils_1.validateInput)(text, maxLen);
        if (err)
            return err;
        return run('URL 解码失败：输入格式不正确', () => (0, utils_1.decodeUrl)(text));
    });
    ctx.command('base64-encode <text:text>', 'Base64 编码').action((_, text) => {
        const err = (0, utils_1.validateInput)(text, maxLen);
        if (err)
            return err;
        return (0, utils_1.encodeBase64)(text);
    });
    ctx.command('base64-decode <text:text>', 'Base64 解码').action((_, text) => {
        const err = (0, utils_1.validateInput)(text, maxLen);
        if (err)
            return err;
        return run('Base64 解码失败：输入不是有效的 Base64 编码', () => {
            const result = (0, utils_1.decodeBase64)(text);
            if (result.length === 0)
                throw new Error('empty result');
            return result;
        });
    });
    ctx.command('unicode-encode <text:text>', 'Unicode 编码').action((_, text) => {
        const err = (0, utils_1.validateInput)(text, maxLen);
        if (err)
            return err;
        return (0, utils_1.encodeUnicode)(text);
    });
    ctx.command('unicode-decode <text:text>', 'Unicode 解码').action((_, text) => {
        const err = (0, utils_1.validateInput)(text, maxLen);
        if (err)
            return err;
        return run('Unicode 解码失败：输入包含无效的转义序列', () => {
            const result = (0, utils_1.decodeUnicode)(text);
            if (result.length === 0)
                throw new Error('empty result');
            return result;
        });
    });
}
