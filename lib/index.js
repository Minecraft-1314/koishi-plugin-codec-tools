"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.using = exports.name = void 0;
exports.apply = apply;
const koishi_1 = require("koishi");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
exports.name = 'codec-tools';
exports.using = ['i18n'];
exports.Config = koishi_1.Schema.object({}).i18n({ 'zh-CN': {} });
function apply(ctx, config) {
    const zhCNPath = path_1.default.join(__dirname, './locales/zh-CN.yml');
    const zhCNContent = fs_1.default.readFileSync(zhCNPath, 'utf8');
    const zhCN = yaml_1.default.parse(zhCNContent);
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
        .action((_, text) => text.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join(''));
    ctx.command('unicode-decode <text:text>')
        .action((_, text) => text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16))));
}
