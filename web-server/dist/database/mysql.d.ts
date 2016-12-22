import * as mysql from "mysql";
import { AbstractDatabase, AbstractModel, AbstractQuery } from "./abstract";
export interface IDBConfig {
    host?: string;
    port?: number;
    pass?: string;
    name?: string;
    options?: any;
}
export declare class MysqlDatabase implements AbstractDatabase {
    static db: mysql.IConnection;
    private host;
    private port;
    private pass;
    private name;
    constructor(options?: IDBConfig);
    open(): void;
    model(name: string, schema?: any): MysqlModel;
}
export declare class MysqlModel implements AbstractModel {
    private tableName;
    constructor(tableName: string);
    where(path: string, val?: Object): MysqlQuery;
    all(): MysqlQuery;
}
export declare class MysqlQuery implements AbstractQuery {
    private tableName;
    private field;
    private condition;
    private lastWhere;
    private isCount;
    constructor(tableName: string);
    equals(val: any): this;
    gt(val: number): this;
    gte(val: number): this;
    lt(val: number): this;
    lte(val: number): this;
    ne(val: any): this;
    in(val: any[]): this;
    nin(val: any[]): this;
    select(arg: string): this;
    where(path?: string | Object, val?: any): this;
    count(): this;
    exec(): Promise<any>;
    private tr(val);
}
export default MysqlDatabase;
