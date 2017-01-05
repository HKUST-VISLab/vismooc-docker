/// <reference types="mongoose" />
import * as mongoose from "mongoose";
import { AbstractDatabase, AbstractModel, AbstractQuery } from "./abstract";
export interface IDBConfig {
    host?: string;
    port?: number;
    pass?: string;
    name?: string;
    options?: any;
}
export declare class MongoDatabase implements AbstractDatabase {
    private db;
    private host;
    private port;
    private pass;
    private name;
    constructor(options?: IDBConfig);
    open(): Promise<{}>;
    model(name: string, schema?: mongoose.Schema): MongoModel;
}
export declare class MongoModel implements AbstractModel {
    private model;
    constructor(model: mongoose.Model<any>);
    where(path: string, val?: Object): MongoQuery;
    all(): MongoQuery;
}
export declare class MongoQuery implements AbstractQuery {
    private query;
    private field;
    constructor(query: mongoose.Query<any>);
    equals(val: any): this;
    gt(val: number): this;
    gte(val: number): this;
    in(val: any[]): this;
    lt(val: number): this;
    lte(val: number): this;
    ne(val: any): this;
    nin(val: any[]): this;
    select(arg: string): this;
    where(path?: string | Object, val?: any): this;
    count(): this;
    exec(): Promise<any>;
}
export default MongoDatabase;
