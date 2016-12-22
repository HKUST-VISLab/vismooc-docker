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
const actionTypeOf = (query) => query.type;
const startDateOf = (query) => query.startDate ? date_1.parseDate(query.startDate) : null;
const endDateOf = (query) => query.endDate ? date_1.parseDate(query.endDate) : null;
const getPopularity = (hotness) => {
    if (hotness && hotness.length) {
        return hotness
            .map((d) => d.value)
            .reduce((a, b) => a + b); // TODO is initiate value needed ?
    }
    else {
        return 0;
    }
};
const videoHotness = (video) => Object.keys(video.temporalHotness).length ?
    Object.keys(video.temporalHotness)
        .map((d) => ({
        date: date_1.parseDate(d),
        value: video.temporalHotness[d],
    })) : [];
const getVideoRouters = new Router()
    .get("/getContentBasedData", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.body) {
        yield next();
        return;
    }
    const query = ctx.query;
    const videoId = videoIdOf(query);
    const clickType = actionTypeOf(query);
    if (clickType === "action") {
        const video = yield Data.getVideoById(videoId);
        if (video === null) {
            ctx.body = null;
            console.warn("cannot find the video in the database");
            yield next();
            return;
        }
        const videoLength = video.duration;
        const startDateBound = startDateOf(query);
        const endDateBound = endDateOf(query);
        let logs = yield Data.getDenselogsById(videoId);
        logs = logs ? logs
            .filter((d) => (!startDateBound || d.timestamp >= startDateBound) &&
            (!endDateBound || d.timestamp <= endDateBound)) : [];
        const clicks = logs.length ?
            logs.map((d) => d.clicks)
                .reduce((a, b) => a.concat(b)) : [];
        const map = new Map();
        clicks.forEach((d) => {
            const time = Math.min(Math.floor(d.currentTime || d.oldTime), videoLength - 1);
            const type = d.type;
            if (!map[type]) {
                map[type] = new Array(videoLength).fill(0);
            }
            ++map[type][time];
        });
        const sum = (a) => a.reduce((p, q) => p + q);
        const actions = Object.keys(map)
            .map((d) => ([d, map[d]]))
            .filter((d) => d[0] !== "show_transcript" && d[0] !== "hide_transcript")
            .sort((a, b) => (sum(a) - sum(b)));
        ctx.body = {
            videoId: videoId.toString(),
            clicks: actions.map((d) => ({
                type: d[0],
                data: d[1],
            })),
        };
        yield next();
    }
    else if (clickType === "seek") {
        const startDateBound = startDateOf(query);
        const endDateBound = endDateOf(query);
        let logs = yield Data.getDenselogsById(videoId);
        logs = logs ? logs
            .filter((d) => (!startDateBound || d.timestamp >= startDateBound) &&
            (!endDateBound || d.timestamp <= endDateBound)) : [];
        const clicks = logs && logs.length && logs
            .map((d) => d.clicks)
            .reduce((a, b) => a.concat(b))
            .filter((d) => d.type === "seek_video") || [];
        ctx.body = clicks.map((log) => ({
            username: log.userId,
            prevTime: log.oldTime,
            currentTime: log.newTime,
        }));
        yield next();
    }
}))
    .get("/getHotness", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx.body) {
        yield next();
        return;
    }
    const query = ctx.query;
    const courseId = courseIdOf(query);
    const currentCourse = yield Data.getCourseById(courseId);
    const startDate = date_1.parseDate(currentCourse.startDate);
    const videoIds = currentCourse.videoIds;
    const videos = yield Data.getVideosByList(videoIds);
    ctx.body = videos
        .map((v) => {
        return {
            videoId: v.originalId,
            _id: v._id,
            date: startDate,
            title: v.name,
            pop: getPopularity(videoHotness(v)),
        };
    })
        .sort((a, b) => b.date - a.date);
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
        const hotness = videoHotness(v);
        const date = hotness.length ?
            hotness[0].date : startDate;
        const week = date_1.getWeeks(new Date(date));
        return {
            _id: v._id,
            courseId: v.courseId,
            date: startDate,
            pop: getPopularity(hotness),
            title: v.name,
            videoId: v.originalId,
            videoLength: v.duration,
            videoSource: v.url,
            week,
        };
    });
    // const tlist = formattedVideos.map(d => d.week);
    const minWeek = Math.min(...videos.map((d) => d.week)) || 0;
    videos.forEach((d) => {
        d.week = d.week - minWeek + 1;
    });
    const maxWeek = Math.max(...videos.map((d) => d.week)) || 1;
    let videosByWeek = [];
    for (let i = 0; i < maxWeek; ++i) {
        videosByWeek.push({
            week: i + 1,
            videos: [],
        });
    }
    videos.forEach((v) => {
        videosByWeek[v.week - 1].videos.push(v);
    });
    ctx.body = videosByWeek;
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
    const startDate = yield Data.getCourseStartDate(courseId);
    const endDate = yield Data.getCourseEndDate(courseId);
    ctx.body = {
        hotness,
        startDate: startDate,
        endDate: endDate,
    };
    yield next();
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getVideoRouters;

//# sourceMappingURL=get-video.js.map
