"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const events_1 = require("events");
const database_manager_1 = require("../../database/database-manager");
class BaseStore extends events_1.EventEmitter {
}
exports.BaseStore = BaseStore;
class RedisStore extends BaseStore {
    constructor() {
        super();
        this.redis = database_manager_1.default.CacheDatabase;
    }
    get(sid) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.redis.get(sid);
            return JSON.parse(session);
            // return Promise.resolve(JSON.parse(session));
        });
    }
    set(sid, val, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            this.redis.set(sid, JSON.stringify(val));
            this.redis.expire(sid, ttl);
            // return Promise.resolve();
        });
    }
    destroy(sid) {
        return __awaiter(this, void 0, void 0, function* () {
            this.redis.del(sid);
            // return Promise.resolve();
        });
    }
}
exports.RedisStore = RedisStore;
;
class MemoryStore extends BaseStore {
    constructor() {
        super();
        this.sessions = {};
        this.timeouts = {};
    }
    get(sid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sessions[sid];
        });
    }
    set(sid, val, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sessions[sid] = val;
            if (sid in this.timeouts) {
                clearTimeout(this.timeouts[sid]);
            }
            this.timeouts[sid] = setTimeout(() => {
                delete this.sessions[sid];
                delete this.timeouts[sid];
            }, ttl);
        });
    }
    destroy(sid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sid in this.timeouts) {
                delete this.sessions[sid];
                clearTimeout(this.timeouts[sid]);
                delete this.timeouts[sid];
            }
        });
    }
}
exports.MemoryStore = MemoryStore;
;
/**
 * Warning message for `MemoryStore` usage in production.
 */
const warning = `Warning: koa-generic-session\'s MemoryStore is not
    designed for a production environment, as it will leak
    memory, and will not scale past a single process.`;
const PREFIX = "koa:sess:";
exports.EVENT_TYPE_CONNECT = "connect";
exports.EVENT_TYPE_DISCONNECT = "disconnect";
class Store extends BaseStore {
    constructor(store = new RedisStore()) {
        super();
        this.store = store;
        // notify user that this store is not
        // meant for a production environment
        if ("production" === process.env.NODE_ENV && store instanceof MemoryStore) {
            console.warn(warning);
        }
        // delegate client connect / disconnect event
        if (typeof store.on === "function") {
            this.store.on(exports.EVENT_TYPE_DISCONNECT, this.emit.bind(this, exports.EVENT_TYPE_DISCONNECT));
            this.store.on(exports.EVENT_TYPE_CONNECT, this.emit.bind(this, exports.EVENT_TYPE_CONNECT));
        }
    }
    get(sid) {
        return __awaiter(this, void 0, void 0, function* () {
            const sess = yield this.store.get(PREFIX + sid);
            if (sess && sess.cookieOptions && typeof sess.cookieOptions.expires === "string") {
                // make sure data.cookie.expires is a Date
                sess.cookieOptions.expires = new Date(sess.cookieOptions.expires);
            }
            return sess;
        });
    }
    set(sid, sess, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ttl) {
                const maxage = sess.cookieOptions && sess.cookieOptions.maxage;
                if (typeof maxage === "number") {
                    ttl = maxage;
                }
                // if has cookie.expires, ignore cookie.maxage
                if (sess.cookieOptions && sess.cookieOptions.expires) {
                    ttl = Math.ceil(sess.cookieOptions.expires.getTime() - Date.now());
                }
            }
            yield this.store.set(PREFIX + sid, sess, ttl);
        });
    }
    destroy(sid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.store.destroy(PREFIX + sid);
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Store;

//# sourceMappingURL=store.js.map
