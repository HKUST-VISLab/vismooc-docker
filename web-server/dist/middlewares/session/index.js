"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const base64_url_1 = require("../../utils/base64-url");
const crc32_1 = require("../../utils/crc32");
const parseurl_1 = require("../../utils/parseurl");
const random_bytes_1 = require("../../utils/random-bytes");
const store_1 = require("./store");
const defaultCookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    overwrite: true,
    path: "/",
    secure: false,
    signed: true,
};
const AVAILABEL = "AVAILABEL";
const PENDING = "PENDING";
const UNAVAILABLE = "UNAVAILABLE";
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
function session(options = {}) {
    const key = options.key || "koa.sid";
    const errorHandler = options.errorHandler || defaultErrorHanlder;
    const reconnectTimeout = options.reconnectTimeout || 10000;
    const genSid = options.genSid || uidSync;
    const valid = options.valid || (() => true);
    const beforeSave = options.beforeSave || (() => true);
    const cookieOptions = Object.assign(options.cookie || {}, defaultCookieOptions);
    const store = new store_1.default(options.store);
    let storeStatus = AVAILABEL;
    let waitStore = Promise.resolve({});
    // reconnect when disconnect
    store.on(store_1.EVENT_TYPE_DISCONNECT, () => {
        if (storeStatus !== AVAILABEL) {
            return;
        }
        storeStatus = PENDING;
        waitStore = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (storeStatus === PENDING) {
                    storeStatus = UNAVAILABLE;
                }
                reject(new Error("session store is unavailable"));
            }, reconnectTimeout);
            store.once(store_1.EVENT_TYPE_CONNECT, resolve);
        });
    });
    store.on(store_1.EVENT_TYPE_CONNECT, () => {
        storeStatus = AVAILABEL;
        waitStore = Promise.resolve({});
    });
    const sessionIdStore = options.sessionIdStore || {
        get(ctx) {
            return ctx.cookies.get(key, cookieOptions);
        },
        set(ctx, sid, session) {
            ctx.cookies.set(key, sid, session.cookieOptions);
        },
        reset(ctx) {
            ctx.cookies.set(key, null);
        },
    };
    // save empty session hash for compare
    const EMPTY_SESSION_HASH = hash(generateSession());
    return options.defer ? deferSession : session;
    /**
     * generate a new session
     */
    function generateSession() {
        const session = { cookieOptions: Object.assign({}, cookieOptions) };
        // you can alter the cookie options in nexts
        compatMaxage(session.cookieOptions);
        return session;
    }
    /**
     * check url match cookie's path
     */
    function matchPath(ctx) {
        const pathname = parseurl_1.default(ctx).pathname;
        const cookiePath = cookieOptions.path || "/";
        if (cookiePath === "/") {
            return true;
        }
        if (pathname.indexOf(cookiePath) !== 0) {
            // cookie path not match
            return false;
        }
        return true;
    }
    /**
     * get session from store
     *   get sessionId from cookie
     *   save sessionId into context
     *   get session from store
     */
    function getSession(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!matchPath(ctx)) {
                return;
            }
            if (storeStatus === PENDING) {
                // store is disconnect and pending;
                yield waitStore;
            }
            else if (storeStatus === UNAVAILABLE) {
                // store is unavailable
                throw new Error("session store is unavailable");
            }
            if (!ctx.sessionId) {
                ctx.sessionId = sessionIdStore.get(ctx);
            }
            let session;
            let isNew = false;
            if (!ctx.sessionId) {
                // session id not exist, generate a new one
                session = generateSession();
                ctx.sessionId = genSid(ctx, 24);
                // now the ctx.cookies.get(key) is null
                isNew = true;
            }
            else {
                try {
                    // get session %j with key %s", session, this.sessionId
                    session = yield store.get(ctx.sessionId);
                }
                catch (err) {
                    if (err.code === "ENOENT") {
                        console.warn("get session error, code = ENOENT");
                    }
                    else {
                        console.warn("get session error: ", err.message);
                        errorHandler(err, "get", ctx);
                    }
                }
            }
            // make sure the session is still valid
            if (!session || !valid(ctx, session)) {
                // session is empty or invalid
                session = generateSession();
                ctx.sessionId = genSid(ctx, 24);
                // now the ctx.cookies.get(key) is null
                sessionIdStore.reset(ctx);
                isNew = true;
            }
            // get the originHash
            const originalHash = !isNew && hash(session);
            return {
                originalHash,
                session,
                isNew,
            };
        });
    }
    /**
     * after everything done, refresh the session
     *   if session === null; delete it from store
     *   if session is modified, update cookie and store
     */
    function refreshSession(ctx, session, originalHash, isNew) {
        return __awaiter(this, void 0, void 0, function* () {
            // reject any session changes, and do not update session expiry
            if (ctx._sessionSave === false) {
                console.warn("session save disabled");
                return;
            }
            // delete session
            if (!session) {
                if (!isNew) {
                    console.warn("session set to null, destroy session: %s", this.sessionId);
                    sessionIdStore.reset(ctx);
                    return yield store.destroy(ctx.sessionId);
                }
                console.warn("a new session and set to null, ignore destroy");
                return;
            }
            // force saving non-empty session
            if (ctx._sessionSave === true) {
                console.warn("session save forced");
                return yield saveNow(ctx, ctx.sessionId, session);
            }
            let newHash = hash(session);
            // if new session and not modified, just ignore
            if (!options.allowEmpty && isNew && newHash === EMPTY_SESSION_HASH) {
                // new session and do not modified
                return;
            }
            // rolling session will always reset cookie and session
            if (!options.rolling && newHash === originalHash) {
                // session not modified
                return;
            }
            // session modified
            yield saveNow(ctx, ctx.sessionId, session);
        });
    }
    function saveNow(ctx, id, session) {
        return __awaiter(this, void 0, void 0, function* () {
            compatMaxage(session.cookieOptions);
            // custom before save hook
            beforeSave(ctx, session);
            // update session
            try {
                yield store.set(id, session);
                sessionIdStore.set(ctx, id, session);
            }
            catch (err) {
                console.warn("set session error: ", err.message);
                errorHandler(err, "set", ctx);
            }
        });
    }
    /**
     * common session middleware
     * each request will generate a new session
     *
     * ```
     * let session = this.session;
     * ```
     */
    function session(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.sessionStore = store;
            if (ctx.session || ctx._session) {
                return yield next();
            }
            const result = yield getSession(ctx);
            if (!result) {
                return yield next();
            }
            addCommonAPI(ctx);
            // more flexible
            Object.defineProperties(ctx, {
                _session: {
                    value: result.session,
                    writable: true,
                },
                session: {
                    enumerable: true,
                    get() { return this._session; },
                    set(val) { this._session = val; },
                },
            });
            ctx.regenerateSession = () => __awaiter(this, void 0, void 0, function* () {
                // regenerating session
                if (!result.isNew) {
                    // destroy the old session
                    yield store.destroy(ctx.sessionId);
                }
                ctx.session = generateSession();
                ctx.sessionId = genSid(ctx, 24);
                sessionIdStore.reset(ctx);
                result.isNew = true;
            });
            // make sure `refreshSession` always called
            let firstError = null;
            try {
                yield next();
            }
            catch (err) {
                console.warn("next logic error: %s", err.message);
                firstError = err;
            }
            // can't use finally because `refreshSession` is async
            try {
                yield refreshSession(ctx, ctx.session, result.originalHash, result.isNew);
            }
            catch (err) {
                console.warn("refresh session error: %s", err.message);
                if (firstError) {
                    ctx.app.emit("error", err, ctx);
                }
                firstError = firstError || err;
            }
            if (firstError) {
                throw firstError;
            }
        });
    }
    /**
     * defer session middleware
     * only generate and get session when request use session
     *
     * ```
     * let session = yield this.session;
     * ```
     */
    function deferSession(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.sessionStore = store;
            if (ctx.session) {
                return yield next();
            }
            let isNew = false;
            let originalHash = null;
            let touchSession = false;
            let getter = false;
            // if path not match
            if (!matchPath(ctx)) {
                return yield next();
            }
            addCommonAPI(ctx);
            Object.defineProperties(ctx, {
                session: {
                    get() {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (touchSession) {
                                return this._session;
                            }
                            touchSession = true;
                            getter = true;
                            let result = yield getSession(this);
                            // if cookie path not match
                            // this route's controller should never use session
                            if (!result) {
                                return;
                            }
                            originalHash = result.originalHash;
                            isNew = result.isNew;
                            this._session = result.session;
                            return this._session;
                        });
                    },
                    set(val) {
                        touchSession = true;
                        this._session = val;
                    },
                },
            });
            ctx.regenerateSession = () => __awaiter(this, void 0, void 0, function* () {
                // make sure that the session has been loaded
                yield ctx.session;
                if (!isNew) {
                    // destroy the old session
                    yield store.destroy(ctx.sessionId);
                }
                ctx._session = generateSession();
                ctx.sessionId = genSid(ctx, 24);
                sessionIdStore.reset(ctx);
                // created new session: %s
                isNew = true;
                return ctx._session;
            });
            yield next();
            if (touchSession) {
                // if only this.session=, need try to decode and get the sessionID
                if (!getter) {
                    ctx.sessionId = sessionIdStore.get(ctx);
                }
                yield refreshSession(ctx, ctx._session, originalHash, isNew);
            }
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = session;
function uidSync(ctx, length) {
    return base64_url_1.default.escape(random_bytes_1.randomBytesSync(length).toString("base64"));
}
function addCommonAPI(target) {
    Object.defineProperties(target, {
        _sessionSave: {
            value: null,
            writable: true,
        },
        sessionSave: {
            enumerable: true,
            get() { return this._sessionSave; },
            set(val) { this._sessionSave = val; },
        },
    });
}
/**
 * get the hash of a session include cookie options.
 */
function hash(sess) {
    return crc32_1.default.signed(JSON.stringify(sess));
}
/**
 * cookie use maxage, hack to compat connect type `maxAge`
 */
function compatMaxage(opts) {
    if (opts) {
        opts.maxage = opts.maxage === undefined
            ? opts.maxAge
            : opts.maxage;
        delete opts.maxAge;
    }
}
function defaultErrorHanlder(err, type, ctx) {
    err.name = "koa-generic-session " + type + " error";
    throw err;
}

//# sourceMappingURL=index.js.map
