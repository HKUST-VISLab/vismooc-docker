export declare abstract class AbstractDatabase {
    abstract open(): any;
    abstract model(name: string, schema?: any): AbstractModel;
}
export default AbstractDatabase;
export declare abstract class AbstractModel {
    /**
     * select a field and give condition to limit it.
     */
    abstract where(path: string, val?: Object): AbstractQuery;
    /**
     * select a field and give condition to limit it.
     */
    abstract all(): any;
}
export declare abstract class AbstractQuery {
    /**
     * Specifies a greater than query condition.
     * When called this function, the most recent path passed to where() is used.
     */
    abstract gt(val: number): this;
    /**
     * Specifies a greater than or equal to query condition.
     * When called this function, the most recent path passed to where() is used.
     */
    abstract gte(val: number): this;
    /**
     * Specifies a in specific set query condition.
     * When called this function, the most recent path passed to where() is used.
     */
    abstract in(val: any[]): this;
    /**
     * Specifies a less than than query condition.
     * When called this function, the most recent path passed to where() is used.
     */
    abstract lt(val: number): this;
    /**
     * Specifies a less than or equal than query condition.
     * When called this function, the most recent path passed to where() is used.
     */
    abstract lte(val: number): this;
    /**
     * Specifies a not equal to query condition.
     * When called this function, the most recent path passed to where() is used.
     */
    abstract ne(val: any): this;
    /**
     * Specifies a not in query condition.
     * When called this function, the most recent path passed to where() is used.
     */
    abstract nin(val: any[]): this;
    /**
     * select a field and give condition to limit it.
     */
    abstract where(path?: string | Object, val?: any): this;
    /**
     * Specifies an equal to query condition.
     * When called this function, the most recent path passed to where() is used.
     */
    abstract equals(val: any): this;
    abstract select(arg: string): this;
    /**
     * get the result.
     */
    abstract exec(): Promise<any>;
    abstract count(): this;
}
