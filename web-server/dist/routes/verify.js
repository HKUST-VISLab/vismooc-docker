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
// import * as Data from "../controllers/data";
function courseIdOf(query) {
    const id = query.courseId;
    if (id && id.indexOf(" ") !== -1) {
        return id.replace(new RegExp(" ", "gm"), "+");
    }
    return id || null;
}
// function videoIdOf(query: any): string {
//     return query.videoId || null;
// }
const verifyRouter = new Router()
    .get("/(.*)", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    console.info("in verify router");
    // to check whether the user login or not
    if (!ctx.session.permissions) {
        ctx.body = "no permission.";
        yield next();
        return;
    }
    console.info("login already");
    // to check whether the user has permission to fetch the data of this course
    const query = ctx.query;
    // const videoId = videoIdOf(query);
    const courseId = courseIdOf(query); // || (videoId && await Data.getCourseIdByVideo(videoId));
    if (courseId && !(courseId in ctx.session.permissions)) {
        ctx.body = "no permission to access this resource.";
        yield next();
        return;
    }
    yield next();
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = verifyRouter;

//# sourceMappingURL=verify.js.map
