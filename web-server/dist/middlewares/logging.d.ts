/// <reference types="morgan" />
/**
 * Morgan is the logger middleware
 */
import * as Koa from "koa";
import * as originalMorgan from "morgan";
export interface KoaMorgan {
    (format: "combined", options?: originalMorgan.Options): Koa.Middleware;
    (format: "common", options?: originalMorgan.Options): Koa.Middleware;
    (format: "dev", options?: originalMorgan.Options): Koa.Middleware;
    (format: "short", options?: originalMorgan.Options): Koa.Middleware;
    (format: "tiny", options?: originalMorgan.Options): Koa.Middleware;
    (format: originalMorgan.FormatFn, options?: originalMorgan.Options): Koa.Middleware;
    (format: string, options?: originalMorgan.Options): Koa.Middleware;
    compile(format: string): any;
    compile(format: string): originalMorgan.FormatFn;
    format(name: string, fmt: string): originalMorgan.Morgan;
    format(name: string, fmt: originalMorgan.FormatFn): originalMorgan.Morgan;
    token(name: string, callback: originalMorgan.TokenCallbackFn): originalMorgan.Morgan;
}
declare var _default: KoaMorgan;
export default _default;
