"use strict";
const ioredis = require("ioredis");
class Redis extends ioredis {
    constructor(options = {}) {
        super(Object.assign({}, Redis.defaultOptions, options));
    }
}
Redis.defaultOptions = {
    dropBufferSupport: true,
    port: 6379,
    host: "localhost",
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Redis;
;

//# sourceMappingURL=redis.js.map
