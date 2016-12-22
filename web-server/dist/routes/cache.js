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
const database_manager_1 = require("../database/database-manager");
const cacheRouter = new Router()
    .get("/(.*)", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const redis = database_manager_1.default.CacheDatabase;
    const url = ctx.request.originalUrl;
    const result = yield redis.get(url);
    const cached = result && result !== "[]";
    if (cached) {
        ctx.body = JSON.parse(result);
    }
    yield next();
    if (!cached && ctx.body !== null && ctx.body !== "[]") {
        const value = JSON.stringify(ctx.body);
        redis.set(url, value);
    }
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cacheRouter;

//# sourceMappingURL=cache.js.map
