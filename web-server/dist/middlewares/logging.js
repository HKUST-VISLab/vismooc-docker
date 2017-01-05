"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const originalMorgan = require("morgan");
const promisify_1 = require("../utils/promisify");
const morgan = (format, options) => {
    const fn = promisify_1.default(originalMorgan(format, options));
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield fn(ctx.request, ctx.response);
        }
        catch (err) {
            console.warn("err in logging middleware");
            throw err;
        }
        yield next();
    });
};
morgan.compile = originalMorgan.compile;
morgan.format = originalMorgan.format;
morgan.token = originalMorgan.token;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = morgan;

//# sourceMappingURL=logging.js.map
