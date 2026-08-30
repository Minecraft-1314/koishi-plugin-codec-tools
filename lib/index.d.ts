import { Context, Schema } from 'koishi';
export declare const name = "codec-tools";
export interface Config {
    maxInputLength?: number;
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context, config: Config): void;
