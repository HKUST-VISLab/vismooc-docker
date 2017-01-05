"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mongoose = require("mongoose");
const promisify_1 = require("../utils/promisify");
const database_manager_1 = require("./database-manager");
class MongoDatabase {
    constructor(options = {}) {
        this.host = options.host || "localhost";
        this.port = options.port || 27017;
        this.pass = options.pass || "";
        this.name = options.name || "test";
    }
    open() {
        this.db = mongoose.createConnection(this.host, this.name);
        this.db.on("error", console.error.bind(console, "connection failed."));
        return promisify_1.default(this.db.once, { thisArg: this.db })("open");
    }
    model(name, schema) {
        // TODO improve here
        if (schema === undefined) {
            return new MongoModel(this.db.model(name));
        }
        else {
            return new MongoModel(this.db.model(name, schema));
        }
    }
}
exports.MongoDatabase = MongoDatabase;
class MongoModel {
    // public get model():mongoose.Model<any> {
    //     return this._model;
    // }
    constructor(model) {
        this.model = model;
    }
    where(path, val) {
        return new MongoQuery(this.model.where(path, val));
    }
    all() {
        return new MongoQuery(this.model.find());
    }
}
exports.MongoModel = MongoModel;
class MongoQuery {
    constructor(query) {
        this.field = "";
        this.query = query;
    }
    equals(val) {
        this.query = this.query.equals(val);
        return this;
    }
    gt(val) {
        this.query = this.query.gt(val);
        return this;
    }
    gte(val) {
        this.query = this.query.gte(val);
        return this;
    }
    in(val) {
        this.query = this.query.in(val);
        return this;
    }
    lt(val) {
        this.query = this.query.lt(val);
        return this;
    }
    lte(val) {
        this.query = this.query.lte(val);
        return this;
    }
    ne(val) {
        this.query = this.query.ne(val);
        return this;
    }
    nin(val) {
        this.query = this.query.nin(val);
        return this;
    }
    select(arg) {
        this.field = arg;
        this.query = this.query.select(arg);
        return this;
    }
    where(path, val) {
        this.query = mongoose.Query.prototype.where.apply(this.query, arguments);
        return this;
    }
    count() {
        this.query = this.query.count();
        return this;
    }
    /* Executes the query */
    exec() {
        return __awaiter(this, arguments, void 0, function* () {
            this.query = this.query.lean();
            let self = this.query;
            const model = self.model;
            const query = self.getQuery();
            const options = self._optionsForExec(model);
            const fields = Object.assign({}, self._fields, this.field);
            const schemaOptions = model.schema.options;
            const expires = schemaOptions.expires || 86400;
            const redis = database_manager_1.default.CacheDatabase;
            if (options.lean) {
                return mongoose.Query.prototype.exec.apply(self, arguments);
            }
            const key = JSON.stringify(query) + JSON.stringify(options) + JSON.stringify(fields);
            try {
                const result = yield redis.get(key);
                let docs;
                if (!result) {
                    docs = yield self.exec();
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
}
exports.MongoQuery = MongoQuery;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MongoDatabase;

//# sourceMappingURL=mongo.js.map
