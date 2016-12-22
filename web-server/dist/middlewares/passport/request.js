"use strict";
/* tslint:disable:no-var-requires */
/* mock request without using proxy
    // Property/Method names to be delegated
    let keys = [
        // passport
        '_passport',
        'user',
        'account',
        'authInfo',

        // http.IncomingMessage
        'httpVersion',
        'headers',
        'trailers',
        'setTimeout',
        'method',
        'url',
        'statusCode',
        'socket',
        'connection',

        // Koa's context
        'cookies',
        'throw',

        // Others. Are not supported directly - require proper plugins/middlewares.
        'param',
        'route',
        'xhr',
        'baseUrl',
        'session',
        'body',
        'flash'
    ];

    // remove duplicates
    keys = keys.filter(function (key, i, self) {
        return self.indexOf(key) === i;
    })

    // create a delegate for each key
    const properties = {
        // mock express' .get('trust proxy')
        app: {
            // getter returning a mock for `req.app` containing
            // the `.get()` method
            get() {
                const ctx = this.ctx
                return {
                    get(key) {
                        if (key === 'trust proxy') {
                            return ctx.app.proxy
                        }
                        return undefined
                    }
                }
            }
        }
    }

    keys.forEach((key) => {
        properties[key] = {
            get() {
                const obj = getObject(this.ctx, key)
                if (!obj) return undefined

                // if its a function, call with the proper context
                if (typeof obj[key] === 'function') {
                    return function () {
                        return obj[key].apply(obj, arguments)
                    }
                }

                // otherwise, simply return it
                return obj[key]
            },
            set(value) {
                const obj = getObject(this.ctx, key) || this.ctx.state
                obj[key] = value
            }
        }
    })

    // test where the key is available, either in `ctx.state`, Node's request,
    // Koa's request or Koa's context
    function getObject(ctx, key) {
        if (ctx.state && (key in ctx.state)) {
            return ctx.state
        }

        if (key in ctx.request) {
            return ctx.request
        }

        if (key in ctx.req) {
            return ctx.req
        }

        if (key in ctx) {
            return ctx
        }

        return undefined
    }

    const IncomingMessageExt = require('passport/lib/http/request')

    export default function (ctx) {
        const req = Object.defineProperties({ ctx }, properties);

        // add passport http.IncomingMessage extensions
        req.login = req.logIn = IncomingMessageExt.logIn;
        req.logout = req.logOut = IncomingMessageExt.logOut;
        req.isAuthenticated = IncomingMessageExt.isAuthenticated;
        req.isUnauthenticated = IncomingMessageExt.isUnauthenticated;
        return req;
    }
*/
function createReqMock(ctx) {
    // test where the key is available, either in `ctx.state`, Node's request,
    // Koa's request or Koa's context
    function getObject(target, key) {
        if (target.state && (key in target.state)) {
            return target.state;
        }
        if (key in target.request) {
            return target.request;
        }
        if (key in target.req) {
            return target.req;
        }
        if (key in target) {
            return target;
        }
        return undefined;
    }
    return new Proxy(ctx, {
        get(target, key) {
            const obj = getObject(target, key);
            return obj ? obj[key] : undefined;
        },
        set(target, key, value) {
            const obj = getObject(target, key) || target.state;
            obj[key] = value;
            return true;
        },
    });
}
const IncomingMessageExt = require("passport/lib/http/request");
function default_1(ctx) {
    const req = createReqMock(ctx);
    // add passport http.IncomingMessage extensions
    req.logIn = req.login = IncomingMessageExt.logIn;
    req.logOut = req.logout = IncomingMessageExt.logOut;
    req.isAuthenticated = IncomingMessageExt.isAuthenticated;
    req.isUnauthenticated = IncomingMessageExt.isUnauthenticated;
    return req;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;

//# sourceMappingURL=request.js.map
