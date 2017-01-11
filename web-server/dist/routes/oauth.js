"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Router = require("koa-router");
const init_1 = require("../init");
const passport_1 = require("../middlewares/passport");
exports.OAuthReferer = null;
const securedRouter = new Router()
    .get("/login", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.state.isAuthenticated()) {
        ctx.redirect(`${init_1.CONFIG.subPath}/`);
    }
    else {
        exports.OAuthReferer = ctx.header["referer"];
        console.log(exports.OAuthReferer);
        ctx.redirect(`${init_1.CONFIG.subPath}/oauth`);
    }
}))
    .get("/logout", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.state.isAuthenticated()) {
        ctx.logout();
        ctx.session = {};
        ctx.sessionStore.destroy();
    }
    ctx.redirect(`${init_1.CONFIG.subPath}/`);
}))
    .get("/oauth", passport_1.default.authenticate(passport_1.STRATEGY_NAME))
    .get("/oauth2", passport_1.default.authenticate(passport_1.STRATEGY_NAME, {
    successRedirect: `${init_1.CONFIG.subPath}/`,
    failureRedirect: `${init_1.CONFIG.subPath}/login`,
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = securedRouter;

//# sourceMappingURL=oauth.js.map
