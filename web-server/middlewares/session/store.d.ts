/// <reference types="node" />
import { EventEmitter } from "events";
export interface Session {
    cookieOptions: {
        expires: any;
        maxage: number;
    };
    permissions?: {
        [key: string]: {
            normal: boolean;
            superuser: boolean;
            administrator: boolean;
        };
    };
    passport?: any;
}
export declare abstract class BaseStore extends EventEmitter {
    abstract get(...args: any[]): Promise<Session>;
    abstract set(...args: any[]): Promise<void>;
    abstract destroy(...args: any[]): Promise<void>;
}
export declare class RedisStore extends BaseStore {
    private redis;
    constructor();
    get(sid: any): Promise<Session>;
    set(sid: string, val: Session, ttl: any): Promise<void>;
    destroy(sid: any): Promise<void>;
}
export declare class MemoryStore extends BaseStore {
    private sessions;
    private timeouts;
    constructor();
    get(sid: any): Promise<Session>;
    set(sid: string, val: Session, ttl: any): Promise<void>;
    destroy(sid: any): Promise<void>;
}
export declare const EVENT_TYPE_CONNECT: string;
export declare const EVENT_TYPE_DISCONNECT: string;
export default class Store extends BaseStore {
    private store;
    constructor(store?: BaseStore);
    get(sid: string): Promise<Session>;
    set(sid: string, sess: Session, ttl?: any): Promise<void>;
    destroy(sid: any): Promise<void>;
}
