"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const promisify_1 = require("../../utils/promisify");
const request_1 = require("./request");
/**
 * Passport's initialization middleware for Koa.
 *
 * Intializes Passport for incoming requests, allowing authentication strategies
 * to be applied.
 *
 * If sessions are being utilized, applications must set up Passport with
 * functions to serialize a user into and out of a session.  For example, a
 * common pattern is to serialize just the user ID into the session (due to the
 * fact that it is desirable to store the minimum amount of data in a session).
 * When a subsequent request arrives for the session, the full User object can
 * be loaded from the database by ID.
 *
 * Note that additional middleware is required to persist login state, so we
 * must use the `connect.session()` middleware _before_ `passport.initialize()`.
 *
 * If sessions are being used, this middleware must be in use by the
 * Connect/Express application for Passport to operate.  If the application is
 * entirely stateless (not using sessions), this middleware is not necessary,
 * but its use will not have any adverse impact.
 *
 * Examples:
 *
 *     app.use(connect.cookieParser());
 *     app.use(connect.session({ secret: 'keyboard cat' }));
 *     app.use(passport.initialize());
 *     app.use(passport.session());
 *
 *     passport.serializeUser(function(user, done) {
 *       done(null, user.id);
 *     });
 *
 *     passport.deserializeUser(function(id, done) {
 *       User.findById(id, function (err, user) {
 *         done(err, user);
 *       });
 *     });
 *
 * @return {Function}
 * @api public
 */
function initialize(passport) {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        // koa <-> connect compatibility:
        const userProperty = passport._userProperty;
        // check ctx.req has the userProperty
        if (!ctx.req.hasOwnProperty(userProperty)) {
            Object.defineProperty(ctx.req, userProperty, {
                enumerable: true,
                get() {
                    return ctx.state[userProperty];
                },
                set(val) {
                    ctx.state[userProperty] = val;
                },
            });
        }
        // create mock object for express' req object
        const req = request_1.default(ctx);
        // add Promise-based login method
        const login = req.login;
        ctx.login = ctx.logIn = (user, options) => {
            return new Promise((resolve, reject) => {
                login.call(req, user, options, (err) => err ? reject(err) : resolve());
            });
        };
        // add aliases for passport's request extensions to Koa's context
        ctx.logout = ctx.logOut = req.logout.bind(req);
        ctx.isAuthenticated = req.isAuthenticated.bind(req);
        ctx.isUnauthenticated = req.isUnauthenticated.bind(req);
        // await middleware(req, ctx.response); // .then(() => next());
        // initialize the passport
        req._passport = {};
        req._passport.instance = passport;
        if (req.session && req.session[passport._key]) {
            // load data from existing session
            req._passport.session = req.session[passport._key];
        }
        yield next();
    });
}
/**
 * Passport's default/connect middleware.
 */
// import originalAuthenticate from "./authenticate";
const originalAuthenticate = require("passport/lib/middleware/authenticate");
/**
 * Passport's authenticate middleware for Koa.
 *
 * @param {String|Array} name
 * @param {Object} options
 * @param {GeneratorFunction} callback
 * @return {GeneratorFunction}
 * @api private
 */
function authenticate(passport, name, options = {}, callback) {
    // normalize arguments
    if (typeof options === "function") {
        callback = options;
        options = {};
    }
    if (callback) {
        // When the callback is set, neither `next`, `res.redirect` or `res.end`
        // are called. That is, a workaround to catch the `callback` is required.
        // The `passportAuthenticate()` method below will therefore set
        // `callback.resolve` and `callback.reject`. Then, once the authentication
        // finishes, the modified callback calls the original one and afterwards
        // triggers either `callback.resolve` or `callback.reject` to inform
        // `passportAuthenticate()` that we are ready.
        const originalCallback = callback;
        callback = (err, user, info, status) => {
            Promise.resolve(originalCallback(err, user, info, status))
                .then(() => callback.resolve(false))
                .catch((deeperErr) => callback.reject(deeperErr));
        };
    }
    const middleware = promisify_1.default(originalAuthenticate(passport, name, options, callback));
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        // this functions wraps the connect middleware
        // to catch `next`, `res.redirect` and `res.end` calls
        const p = new Promise((resolve, reject) => {
            // mock the `req` object
            const req = request_1.default(ctx);
            // mock the `res` object
            const res = {
                redirect(url) {
                    ctx.redirect(url);
                    resolve(false);
                },
                setHeader: ctx.set.bind(ctx),
                end(content) {
                    if (content) {
                        ctx.body = content;
                    }
                    resolve(false);
                },
                set statusCode(status) {
                    ctx.status = status;
                },
                get statusCode() {
                    return ctx.status;
                },
            };
            // update the custom callback above
            if (callback) {
                callback.resolve = resolve;
                callback.reject = reject;
            }
            // call the connect middleware
            middleware(req, res).then(resolve, reject);
        });
        // cont equals `false` when `res.redirect` or `res.end` got called
        // in this case, call next to continue through Koa's middleware stack
        const cont = yield p;
        if (cont !== false) {
            yield next();
        }
    });
}
/**
 * Passport's authorize middleware for Koa.
 *
 * @param {String|Array} name
 * @param {Object} options
 * @param {GeneratorFunction} callback
 * @return {GeneratorFunction}
 * @api private
 */
function authorize(passport, name, options, callback) {
    options = options || {};
    options.assignProperty = "account";
    return authenticate(passport, name, options, callback);
}
// empty the monkeypatchNode of passport
// these two lines of code must be placed before import passport
const connect = require("passport/lib/framework/connect");
connect.__monkeypatchNode = new Function();
const passport = require("passport");
const koaFramework = {
    initialize,
    authenticate,
    authorize,
};
passport.framework(koaFramework);
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Framework support for Koa.
 *
 * This module provides support for using Passport with Koa. It exposes
 * middleware that conform to the `fn*(next)` signature and extends
 * Node's built-in HTTP request object with useful authentication-related
 * functions.
 *
 * @return {Object}
 * @api protected
 */
exports.default = passport;
exports.STRATEGY_NAME = "provider";

//# sourceMappingURL=index.js.map
