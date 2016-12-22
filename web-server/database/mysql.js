"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mysql = require("mysql");
const promisify_1 = require("../utils/promisify");
const database_manager_1 = require("./database-manager");
class MysqlDatabase {
    constructor(options = {}) {
        this.host = options.host || "localhost";
        this.port = options.port || 27017;
        this.pass = options.pass || "";
        this.name = options.name || "test";
    }
    open() {
        MysqlDatabase.db = mysql.createConnection({
            host: this.host,
            port: this.port,
            password: this.pass,
            database: this.name,
        });
        MysqlDatabase.db.connect();
    }
    model(name, schema) {
        return new MysqlModel(name);
    }
}
exports.MysqlDatabase = MysqlDatabase;
class MysqlModel {
    constructor(tableName) {
        this.tableName = tableName;
    }
    where(path, val) {
        return new MysqlQuery(this.tableName);
    }
    // public model(): any {
    //     return this.tableName;
    // }
    all() {
        return new MysqlQuery(this.tableName);
    }
}
exports.MysqlModel = MysqlModel;
class MysqlQuery {
    constructor(tableName) {
        this.field = "*";
        this.isCount = false;
        this.tableName = tableName;
        this.condition = "";
    }
    equals(val) {
        this.condition = this.condition + ` where ${this.lastWhere} = ${this.tr(val)}`;
        return this;
    }
    gt(val) {
        this.condition = this.condition + ` where ${this.lastWhere} > ${this.tr(val)}`;
        return this;
    }
    gte(val) {
        this.condition = this.condition + ` where ${this.lastWhere} >= ${this.tr(val)}`;
        return this;
    }
    lt(val) {
        this.condition = this.condition + ` where ${this.lastWhere} < ${this.tr(val)}`;
        return this;
    }
    lte(val) {
        this.condition = this.condition + ` where ${this.lastWhere} <= ${this.tr(val)}`;
        return this;
    }
    ne(val) {
        this.condition = this.condition + ` where ${this.lastWhere} <> ${this.tr(val)}`;
        return this;
    }
    in(val) {
        this.condition = this.condition + ` where ${this.lastWhere} in (${val.map((d) => this.tr(d)).join(",")})`;
        return this;
    }
    nin(val) {
        this.condition = this.condition + ` where ${this.lastWhere} not in (${val.map((d) => this.tr(d)).join(",")})`;
        return this;
    }
    select(arg) {
        this.field = arg.split(" ").join(",");
        return this;
    }
    where(path, val) {
        this.lastWhere = path;
        return this;
    }
    count() {
        this.isCount = true;
        return this;
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            const expires = 86400;
            const redis = database_manager_1.default.CacheDatabase;
            if (this.isCount) {
                this.field = `count(${this.field})`;
            }
            const sql = `select ${this.field} from ${this.tableName} ${this.condition}`;
            const key = sql;
            try {
                const result = yield redis.get(key);
                let docs;
                if (!result) {
                    docs = yield promisify_1.default(MysqlDatabase.db.query, { thisArg: MysqlDatabase.db })(sql);
                    const str = JSON.stringify(docs);
                    redis.set(key, str);
                    redis.expire(key, expires);
                }
                else {
                    docs = JSON.parse(result);
                    redis.expire(key, expires);
                }
                return docs;
            }
            catch (err) {
                throw err;
            }
        });
    }
    tr(val) {
        if (typeof val === "string") {
            return `'${val.toString()}'`;
        }
        else {
            return val.toString();
        }
    }
}
exports.MysqlQuery = MysqlQuery;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MysqlDatabase;

//# sourceMappingURL=mysql.js.map
