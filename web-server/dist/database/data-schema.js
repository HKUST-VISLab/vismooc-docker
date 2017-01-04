"use strict";
const mongoose_1 = require("mongoose");
/*
courses:
    _id: String
    originalId: String
    name: String
    year: Number
    [miss] instructor: String
    [miss] status: String
    [miss] url: String
    image: String
    [miss] description: String
    startDate: Timestamp
    endDate: Timestamp
    [lv1] studentIds: [String]
    [lv1] videoIds: [String]
    metaInfo: String
*/
const courses = new mongoose_1.Schema({
    _id: String,
    originalId: String,
    name: String,
    year: Number,
    org: String,
    advertisedStart: Number,
    courseImageUrl: String,
    lowestPassinggrade: String,
    mobileAvailable: Boolean,
    instructor: [String],
    status: String,
    url: String,
    image: String,
    description: String,
    metaInfo: String,
    startDate: Number,
    endDate: Number,
    enrollmentStart: Number,
    enrollmentEnd: Number,
    studentIds: [String],
    videoIds: [String],
    displayNumberWithDefault: String,
});
/*
users:
    _id : String
    originalId : String
    username: String
    age: Number
    gender: String
    country: String
    [lv1] courseIds : [String]
    [lv1] droppedCourseIds : [String]
*/
const users = new mongoose_1.Schema({
    _id: String,
    originalId: String,
    username: String,
    name: String,
    language: String,
    location: String,
    birthDate: Number,
    educationLevel: String,
    bio: String,
    gender: String,
    country: String,
    courseIds: [String],
    droppedCourseIds: [String],
    courseRoles: Object,
});
/*

enrollments:
    _id: String
    userId: String
    courseId: String
    timestamp: Timestamp
    action: String

*/
const enrollments = new mongoose_1.Schema({
    _id: String,
    userId: String,
    courseId: String,
    timestamp: Number,
    action: String,
});
/*
videos:
    _id: String
    originalId: String
    [lv1] courseId: String
    name: String
    [lv1] temporalHotness: { Date: Number }
    section: String
    [miss] description: String
    [miss] releaseDate: Date
    url: String
    duration: Number
    metalInfo: String
*/
const videos = new mongoose_1.Schema({
    _id: String,
    originalId: String,
    courseId: String,
    name: String,
    temporalHotness: [{ data: Date, value: Number }],
    section: String,
    releaseDate: Number,
    description: String,
    url: String,
    length: Number,
    metaInfo: String,
});
/*
    _id: String
    [miss] originalId: String
    userId: String
    videoId: String
    courseId: String
    timestamp: Timestamp
    type: String
    Event type. Including: play_video, load_video, pause_video, stop_video,
    hide_transcript, show_transcript, speed_change_video, seek_video, video_hide_cc_menu, video_show_cc_menu
    metalInfo:
        path: String
        The URL that generated the event.
        code: String
        For YouTube videos played in a browser, the ID of the video being loaded
        [optional] currentTime: Number
        The time in the video at which the event was emitted.
        Exits in following event type: play_video, pause_video, stop_video,
        hide_transcript, show_transcript, speed_change_video
        [optional] new_time: Number
        The time in the video, in seconds, that the user selected as
        the destination point. Exits in seek_video event type.
        [optional] old_time: Number
        The time in the video, in seconds, at which the user chose to go
        to a different point in the file. Exits in seek_video event type.
        [optional] new_speed: Number
        The speed that the user selected for the video to play:
        ‘0.75’, ‘1.0’, ‘1.25’, ‘1.50’. Exits in speed_change_video event type.
        [optional] old_speed: Number
        The speed at which the video was playing. Exits in speed_change_video event type.
*/
const logs = new mongoose_1.Schema({
    _id: String,
    metaInfo: Object,
    userId: String,
    videoId: String,
    courseId: String,
    timestamp: Number,
    type: String,
});
const denselogs = new mongoose_1.Schema({
    _id: String,
    videoId: String,
    courseId: String,
    timestamp: Number,
    clicks: [Object],
});
const DataSchema = {
    enrollments,
    users,
    courses,
    logs,
    videos,
    denselogs,
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataSchema;

//# sourceMappingURL=data-schema.js.map
