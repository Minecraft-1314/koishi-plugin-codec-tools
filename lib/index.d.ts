import { Context, Schema } from 'koishi';
export declare const name = "codec-tools";
export declare const using: readonly ["i18n"];
export interface Config {
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context, config: Config): void;
