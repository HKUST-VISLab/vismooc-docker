"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const R = require("ramda");
const database_manager_1 = require("../database/database-manager");
const date_1 = require("../utils/date");
function firstElement(els) {
    return els && els.length ? els[0] : null;
}
function getCoursesById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_manager_1.default.Database.model("courses")
            .where("originalId").equals(id)
            .exec();
    });
}
exports.getCoursesById = getCoursesById;
function getVideosById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_manager_1.default.Database.model("videos")
            .where("originalId").equals(id)
            .exec();
    });
}
exports.getVideosById = getVideosById;
function getUsersById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_manager_1.default.Database.model("users")
            .where("username").equals(id)
            .exec();
    });
}
exports.getUsersById = getUsersById;
function getVideosByList(videoIds) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_manager_1.default.Database.model("videos")
            .where("originalId").in(videoIds)
            .exec();
    });
}
exports.getVideosByList = getVideosByList;
function getCoursesByList(courseIds) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_manager_1.default.Database.model("courses")
            .where("originalId").in(courseIds)
            .exec();
    });
}
exports.getCoursesByList = getCoursesByList;
function getCourseIdByVideo(videoId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield database_manager_1.default.Database.model("videos")
            .where("originalId").equals(videoId)
            .select("courseId")
            .exec()).courseId;
    });
}
exports.getCourseIdByVideo = getCourseIdByVideo;
function getUsersByList(userIds) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_manager_1.default.Database.model("users")
            .where("username").in(userIds)
            .exec();
    });
}
exports.getUsersByList = getUsersByList;
function getDenselogsById(videoId) {
    return __awaiter(this, void 0, void 0, function* () {
        const denselogModel = database_manager_1.default.Database.model("denselogs");
        return yield denselogModel
            .where("videoId").equals(videoId)
            .exec();
    });
}
exports.getDenselogsById = getDenselogsById;
exports.getVideoById = R.memoize((id) => __awaiter(this, void 0, void 0, function* () { return getVideosById(id).then(firstElement); }));
exports.getCourseById = R.memoize((id) => __awaiter(this, void 0, void 0, function* () { return getCoursesById(id).then(firstElement); }));
exports.getUserById = R.memoize((id) => __awaiter(this, void 0, void 0, function* () { return getUsersById(id).then(firstElement); }));
function getCourseStartDate(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return exports.getCourseById(id)
            .then((course) => course && course.startDate ? course.startDate : 0)
            .then(date_1.parseDate);
    });
}
exports.getCourseStartDate = getCourseStartDate;
function getCourseEndDate(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return exports.getCourseById(id)
            .then((course) => course && course.endDate ? course.endDate : 0)
            .then(date_1.parseDate);
    });
}
exports.getCourseEndDate = getCourseEndDate;

//# sourceMappingURL=data.js.map
