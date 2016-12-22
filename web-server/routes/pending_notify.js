"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fs = require("fs");
const Router = require("koa-router");
const promisify_1 = require("../utils/promisify");
const readFile = promisify_1.default(fs.readFile);
const appendFile = promisify_1.default(fs.appendFile);
const postDataFile = "./postData.txt";
const notifyRouter = new Router()
    .get("/", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    ctx.body = yield readFile("./public/index.html", "utf8");
    yield next();
}))
    .post("/notify", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const postBody = ctx.request.body;
    const dataToWrite = `${Date.now()}\t${ctx.request.ip}\t${JSON.stringify(postBody)}\n`;
    yield appendFile(postDataFile, dataToWrite, "utf8");
    ctx.response.status = 200;
    yield next();
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = notifyRouter;

//# sourceMappingURL=pending_notify.js.map
