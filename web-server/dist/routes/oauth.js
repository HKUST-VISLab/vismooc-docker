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
const passport_1 = require("../middlewares/passport");
const securedRouter = new Router();
securedRouter.get("/login", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    console.info("session=", ctx.session);
    if (!ctx.state.isAuthenticated()) {
        ctx.redirect("/oauth");
    }
    else {
        return;
    }
}))
    .get("/oauth", passport_1.default.authenticate(passport_1.STRATEGY_NAME))
    .get("/oauth2", passport_1.default.authenticate(passport_1.STRATEGY_NAME, {
    successRedirect: "/",
    failureRedirect: "/login",
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = securedRouter;

//# sourceMappingURL=oauth.js.map
