"use strict";
// import notifyRouter from "./routes/notify";
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const staticFile = require("koa-static");
const init_1 = require("./init");
const logging_1 = require("./middlewares/logging");
const passport_1 = require("./middlewares/passport");
const strategy_1 = require("./middlewares/passport/strategy");
const permission_1 = require("./middlewares/permission");
const session_1 = require("./middlewares/session");
const get_course_1 = require("./routes/get-course");
const get_video_1 = require("./routes/get-video");
const oauth_1 = require("./routes/oauth");
const verify_1 = require("./routes/verify");
function Server() {
    const app = new Koa();
    // app.use(require("kcors")());
    app.use(logging_1.default("combined"));
    app.use(bodyParser());
    app.use(staticFile("./public/"));
    app.keys = ["secret"];
    app.use(session_1.default());
    passport_1.default.use(passport_1.STRATEGY_NAME, new strategy_1.Strategy(init_1.CONFIG.oauth2, (accessToken, refreshToken, profile, done) => {
        const user = profile;
        // Return user model
        return done(null, user);
    }));
    passport_1.default.serializeUser((user, done) => {
        // console.log("serializeUser", user);
        done(null, user.username);
    });
    passport_1.default.deserializeUser((id, done) => {
        // console.log("deserializeUser", id);
        done(null, id);
    });
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use(oauth_1.default.routes());
    app.use(permission_1.default({}));
    app.use(verify_1.default.routes());
    app.use(get_course_1.default.routes());
    app.use(get_video_1.default.routes());
    return app;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Server;

//# sourceMappingURL=server.js.map
