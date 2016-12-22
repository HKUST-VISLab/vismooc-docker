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
const Data = require("../controllers/data");
const strSpaceToPlus = (s) => s.replace(new RegExp(" ", "gm"), "+");
const contains = (s, substr) => s.indexOf(substr) !== -1;
const courseIdOf = (query) => {
    const id = query.courseId;
    if (id && contains(id, " ")) {
        return strSpaceToPlus(id);
    }
    else {
        return id || null;
    }
};
const videoIdOf = (query) => query.videoId || null;
const verifyRouter = new Router()
    .get("/(.*)", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    console.info("in verify router");
    if (!ctx.session.permissions) {
        ctx.body = "no permission.";
        yield next();
        return;
    }
    console.info("have permission");
    const query = ctx.query;
    const videoId = videoIdOf(query);
    const courseId = courseIdOf(query) || (videoId && (yield Data.getCourseIdByVideo(videoId)));
    if (courseId && !ctx.session.permissions[courseId]) {
        ctx.body = "no permission to access this resource.";
        yield next();
        return;
    }
    const params = String(ctx.params[0]);
    if (!params.startsWith("get")) {
        yield next();
        return;
    }
    yield next();
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = verifyRouter;

//# sourceMappingURL=verify.js.map
