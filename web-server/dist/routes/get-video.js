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
const date_1 = require("../utils/date");
function courseIdOf(query) {
    const id = query.courseId;
    if (id && id.indexOf(" ") !== -1) {
        return id.replace(new RegExp(" ", "gm"), "+");
    }
    return id || null;
}
function videoIdOf(query) {
    return query.videoId || null;
}
function actionTypeOf(query) {
    return query.type;
}
function startDateOf(query) {
    return query.startDate ? date_1.parseDate(query.startDate) : null;
}
function endDateOf(query) {
    return query.endDate ? date_1.parseDate(query.endDate) : null;
}
// function getPopularity(hotness: any[]) {
//     return hotness
//         .map((d) => d.value)
//         .reduce((a, b) => a + b, 0);
// }
function logs2clicks(logs, actionType = null) {
    const clicks = logs
        .map((d) => d.clicks)
        .reduce((a, b) => a.concat(b), []);
    return actionType ? clicks.filter((d) => d.type === actionType) : clicks;
}
function videoHotness(video) {
    const keys = Object.keys(video.temporalHotness);
    return keys.map((d) => ({
        date: date_1.parseDate(d),
        value: video.temporalHotness[d],
    }));
}
const getVideoRouters = new Router()
    .get("/getContentBasedData", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.body) {
        yield next();
        return;
    }
    const query = ctx.query;
    const videoId = videoIdOf(query);
    const courseId = courseIdOf(query);
    const clickType = actionTypeOf(query);
    if (clickType === "action") {
        const video = yield Data.getVideoById(videoId);
        if (video === null) {
            ctx.body = null;
            console.warn("cannot find the video in the database");
            yield next();
            return;
        }
        const startDateBound = startDateOf(query);
        const endDateBound = endDateOf(query);
        let logs = yield Data.getDenselogsById(courseId, videoId);
        logs = logs.filter((d) => (!startDateBound || d.timestamp >= startDateBound) &&
            (!endDateBound || d.timestamp <= endDateBound));
        const clicks = logs2clicks(logs);
        const clicksDistribution = new Map();
        const videoLength = video.duration;
        for (const click of clicks) {
            const time = Math.min(Math.floor(click.currentTime || click.oldTime), videoLength - 1);
            const type = click.type;
            if (!(type in clicksDistribution)) {
                clicksDistribution[type] = new Array(videoLength).fill(0);
            }
            ++clicksDistribution[type][time];
        }
        // const sum = (a) => a.reduce((p, q) => p + q);
        const actions = Object.keys(clicksDistribution)
            .filter(d => d !== "show_transcript" && d !== "hide_transcript")
            .map((d) => ([d, clicksDistribution[d]]));
        // .sort((a, b) => (sum(a) - sum(b)));
        ctx.body = {
            videoId: videoId.toString(),
            clicks: actions.map((d) => ({
                type: d[0],
                data: d[1],
            })),
        };
    }
    else if (clickType === "seek") {
        const startDateBound = startDateOf(query);
        const endDateBound = endDateOf(query);
        let logs = yield Data.getDenselogsById(courseId, videoId);
        logs = logs.filter((d) => (!startDateBound || d.timestamp >= startDateBound) &&
            (!endDateBound || d.timestamp <= endDateBound));
        const clicks = logs2clicks(logs, "seek_video");
        ctx.body = clicks.map((log) => ({
            username: log.userId,
            prevTime: log.oldTime,
            currentTime: log.newTime,
        }));
    }
    yield next();
}))
    .get("/getVideoList", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.body) {
        yield next();
        return;
    }
    const query = ctx.query;
    const courseId = courseIdOf(query);
    const currentCourse = yield Data.getCourseById(courseId);
    const startDate = date_1.parseDate(currentCourse.startDate);
    const videoIds = currentCourse.videoIds;
    const videos = (yield Data.getVideosByList(videoIds))
        .map((v, i) => {
        return {
            _id: v._id,
            courseId: v.courseId,
            date: startDate,
            title: v.name,
            videoId: v.originalId,
            videoLength: v.duration,
            videoSource: v.url || "",
            section: v.section,
        };
    });
    ctx.body = videos;
    yield next();
}))
    .get("/getVideoPop", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.body) {
        yield next();
        return;
    }
    const query = ctx.query;
    const courseId = courseIdOf(query);
    const videoId = query.videoId;
    const video = yield Data.getVideoById(videoId);
    const hotness = videoHotness(video);
    const course = yield Data.getCourseById(courseId);
    ctx.body = {
        hotness,
        startDate: date_1.parseDate(course.startDate),
        endDate: date_1.parseDate(course.endData),
    };
    yield next();
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getVideoRouters;

//# sourceMappingURL=get-video.js.map
