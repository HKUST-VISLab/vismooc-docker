import { AbstractDatabase } from "./abstract";
import Redis from "./redis";
export default class DatabaseManager {
    static init(): Promise<void>;
    static readonly Database: AbstractDatabase;
    static readonly CacheDatabase: Redis;
    private static database;
    private static cacheDatabase;
}
