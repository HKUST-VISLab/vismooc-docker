"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const data_schema_1 = require("../database/data-schema");
const init_1 = require("../init");
const mongo_1 = require("./mongo");
const redis_1 = require("./redis");
class DatabaseManager {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (DatabaseManager.Database === null) {
                const db = new mongo_1.MongoDatabase(init_1.CONFIG.mongo);
                yield db.open();
                console.info("open db success");
                db.model("courses", data_schema_1.default.courses);
                db.model("enrollments", data_schema_1.default.enrollments);
                db.model("users", data_schema_1.default.users);
                db.model("videos", data_schema_1.default.videos);
                db.model("logs", data_schema_1.default.logs);
                db.model("denselogs", data_schema_1.default.denselogs);
                DatabaseManager.database = db;
            }
            if (DatabaseManager.CacheDatabase === null) {
                DatabaseManager.cacheDatabase = new redis_1.default(init_1.CONFIG.redis);
            }
        });
    }
    static get Database() {
        return DatabaseManager.database;
    }
    ;
    static get CacheDatabase() {
        return DatabaseManager.cacheDatabase;
    }
}
DatabaseManager.database = null;
DatabaseManager.cacheDatabase = null;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DatabaseManager;

//# sourceMappingURL=database-manager.js.map
