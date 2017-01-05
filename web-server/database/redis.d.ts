/// <reference types="ioredis" />
import * as ioredis from "ioredis";
export default class Redis extends ioredis {
    static defaultOptions: {
        dropBufferSupport: boolean;
        port: number;
        host: string;
    };
    constructor(options?: {});
}
