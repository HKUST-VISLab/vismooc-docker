import * as Koa from "koa";
import { BaseStore, Session } from "./store";
export { Session } from "./store";
export interface SessionIdStore {
    get(ctx: Koa.Context): any;
    set(ctx: Koa.Context, sid: string, session: Session): void;
    reset(ctx: Koa.Context): void;
}
export interface SessionOptions {
    key?: any;
    store?: BaseStore;
    ttl?: any;
    cookie?: any;
    path?: any;
    defer?: any;
    rolling?: any;
    genSid?: Function;
    reconnectTimeout?: 10000;
    errorHandler?: Function;
    valid?: Function;
    beforeSave?: Function;
    sessionIdStore?: SessionIdStore;
    allowEmpty?: boolean;
}
declare module "koa" {
    interface Context {
        sessionId?: any;
        sessionStore?: any;
        session: Session;
        _session: Session;
        sessionSave: boolean;
        _sessionSave: boolean;
        regenerateSession: () => void;
    }
}
/**
 * setup session store with the given `options`
 * @param {Object} options
 *   - [`key`] cookie name, defaulting to `koa.sid`
 *   - [`store`] session store instance, default to MemoryStore
 *   - [`ttl`] store ttl in `ms`, default to oneday
 *   - [`prefix`] session prefix for store, defaulting to `koa:sess:`
 *   - [`cookie`] session cookie settings, defaulting to
 *     {path: '/', httpOnly: true, maxAge: null, rewrite: true, signed: true}
 *   - [`defer`] defer get session,
 *   - [`rolling`]  rolling session, always reset the cookie and sessions, default is false
 *     you should `yield this.session` to get the session if defer is true, default is false
 *   - [`genSid`] you can use your own generator for sid
 *   - [`errorHanlder`] handler for session store get or set error
 *   - [`valid`] valid(ctx, session), valid session value before use it
 *   - [`beforeSave`] beforeSave(ctx, session), hook before save session
 *   - [`sessionIdStore`] object with get, set, reset methods for passing session id throw requests.
 */
export default function session(options?: SessionOptions): (ctx: Koa.Context, next: any) => Promise<any>;
