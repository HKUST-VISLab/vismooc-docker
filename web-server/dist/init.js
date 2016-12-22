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
const mongoose = require("mongoose");
const database_manager_1 = require("./database/database-manager");
exports.CONFIG = {
    mongo: {
        host: "localhost",
        name: "test-vismooc-newData",
        port: 27017,
    },
    redis: {
        port: 6379,
        host: "localhost",
    },
    oauth2: {
        authorizationURL: "https://learn2.hkmooc.hk/oauth2/authorize/",
        tokenURL: "https://learn2.hkmooc.hk/oauth2/access_token/",
        callbackURL: "http://localhost:9999/oauth2/",
        clientID: "zhutian_testing_client",
        clientSecret: "5d004c7056fa6908530b88e0f97d3076210caf7a",
        scope: ["openid", "profile", "email", "course_staff", "course_instructor", "permissions"],
    },
};
function initAll() {
    return __awaiter(this, void 0, void 0, function* () {
        const configFilePath = process.argv.slice(0)[2];
        if (configFilePath) {
            console.info("read config file from " + configFilePath);
            const config = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
            exports.CONFIG = Object.assign(exports.CONFIG, config.webserver);
            exports.CONFIG.mongo = Object.assign(exports.CONFIG.mongo, config.mongo);
        }
        mongoose.Promise = global.Promise;
        yield database_manager_1.default.init();
        database_manager_1.default.CacheDatabase.flushall();
    });
}
exports.initAll = initAll;

//# sourceMappingURL=init.js.map
