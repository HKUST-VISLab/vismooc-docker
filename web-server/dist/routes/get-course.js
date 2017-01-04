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
// import { OAuthReferer } from "../routes/oauth";
// import { parseDate } from "../utils/date";
function courseIdOf(query) {
    const id = query.courseId;
    if (id && id.indexOf(" ") !== -1) {
        return id.replace(new RegExp(" ", "gm"), "+");
    }
    return id || null;
}
const getCourseRouters = new Router()
    .get("/getCourseInfo", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.body) {
        yield next();
        return;
    }
    const query = ctx.query;
    const courseId = courseIdOf(query);
    const ret = yield Data.getCourseById(courseId);
    ctx.body = ret && {
        _id: ret._id,
        courseId: ret.originalId,
        courseName: ret.name,
        instructor: ret.instructor,
        url: ret.url,
        img: ret.image,
        description: ret.description,
    };
    yield next();
}))
    .get("/getCourseList", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.body) {
        yield next();
        return;
    }
    console.log("in get course list");
    // console.log(OAuthReferer);
    // OAuthReferer.indexOf("course/");
    // "https://learn2.hkmooc.hk/courses/course-v1:HKUST+bt001+2016_Q1_R1/courseware/c338c06fa3ed45468f9e75a4d5079a76/1c329485d15540d1ab75405b5739117b/"
    // OAuthReferer.indexOf()
    const ret = yield Data.getCoursesByList(Object.keys(ctx.session.permissions));
    ctx.body = ret.map((course) => ({
        _id: course._id,
        courseId: course.originalId,
        courseName: course.name,
        instructor: course.instructor,
        url: course.url,
        img: course.image,
        description: course.description,
    }));
    yield next();
}))
    .get("/getHotness", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.body) {
        yield next();
        return;
    }
    const query = ctx.query;
    const courseId = courseIdOf(query);
    const course = yield Data.getCourseById(courseId);
    const videoIds = course.videoIds;
    const videos = yield Data.getVideosByList(videoIds);
    ctx.body = videos
        .map((v) => {
        const pop = Object.keys(v.temporalHotness)
            .map(key => +v.temporalHotness[key])
            .reduce((a, b) => a + b, 0);
        return {
            videoId: v.originalId,
            section: v.section,
            title: v.name,
            pop,
        };
    });
    yield next();
}))
    .get("/getDemographicData", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.body) {
        yield next();
        return;
    }
    const query = ctx.query;
    const courseId = courseIdOf(query);
    const course = yield Data.getCourseById(courseId);
    const studentIds = course.studentIds;
    const students = yield Data.getUsersByList(studentIds);
    const dict = new Map();
    for (const student of students) {
        student.country = student.country || "CHN";
        if (!(student.country in dict)) {
            dict[student.country] = 0;
        }
        dict[student.country] += 1;
    }
    ctx.body = Object.keys(dict).map((key) => ({
        code3: key,
        count: dict[key],
    }));
    yield next();
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getCourseRouters;

//# sourceMappingURL=get-course.js.map
