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
const getCourseRouters = new Router()
    .get("/getCourseInfo", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.body) {
        yield next();
        return;
    }
    const query = ctx.query;
    const courseId = courseIdOf(query);
    const ret = yield Data.getCourseById(courseId);
    ctx.body = ret ? {
        _id: ret._id,
        courseId: ret.originalId,
        courseName: ret.name,
        instructor: ret.instructor,
        url: ret.url,
        img: ret.image,
        description: ret.description,
    } : null;
    yield next();
}))
    .get("/getCourseList", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.body) {
        yield next();
        return;
    }
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
    .get("/getDemographicData", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.body) {
        yield next();
        return;
    }
    const query = ctx.query;
    const courseId = courseIdOf(query);
    let course = yield Data.getCourseById(courseId);
    const studentIds = course.studentIds;
    const students = yield Data.getUsersByList(studentIds);
    let dict = new Map();
    students.forEach((d) => {
        d.country = d.country || "CHN";
        if (!dict[d.country]) {
            dict[d.country] = 0;
        }
        dict[d.country] += 1;
    });
    ctx.body = Object.keys(dict).map((key) => ({
        code3: key,
        count: dict[key],
    }));
    yield next();
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getCourseRouters;

//# sourceMappingURL=get-course.js.map
