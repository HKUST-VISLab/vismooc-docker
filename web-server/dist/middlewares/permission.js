"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const data_1 = require("../controllers/data");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (options) => {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        if (!ctx.session.passport) {
            yield next();
            return;
        }
        const username = ctx.session.passport.user;
        const user = yield data_1.getUserById(username);
        const permissions = {};
        if (user && user.courseRoles) {
            const courseRoles = user.courseRoles;
            Object.keys(courseRoles).forEach(course => {
                const role = new Set(courseRoles[course]);
                permissions[course] = role.has("instructor") || role.has("staff");
            });
        }
        console.info("in permissions middleware");
        console.info(ctx.session.passport);
        if (ctx.session.passport && ctx.session.passport.user) {
            ctx.session.permissions = permissions;
        }
        yield next();
    });
};

//# sourceMappingURL=permission.js.map
