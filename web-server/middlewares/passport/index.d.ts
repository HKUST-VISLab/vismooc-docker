/// <reference types="express" />
import * as express from "express";
import * as Koa from "koa";
declare module "koa" {
    interface Request {
        authInfo?: any;
        user?: any;
        login(user: any, done: (err: any) => void): void;
        login(user: any, options: Object, done: (err: any) => void): void;
        logIn(user: any, done: (err: any) => void): void;
        logIn(user: any, options: Object, done: (err: any) => void): void;
        logout(): void;
        logOut(): void;
        isAuthenticated(): boolean;
        isUnauthenticated(): boolean;
    }
}
export interface Passport {
    strategies: Strategy;
    use(strategy: Strategy): Passport;
    use(name: string, strategy: Strategy): Passport;
    unuse(name: string): Passport;
    framework(fw: Framework): Passport;
    initialize(options?: {
        userProperty: string;
    }): Koa.Middleware;
    session(options?: {
        pauseStream: boolean;
    }): Koa.Middleware;
    authenticate(strategy: string, callback?: Function): Koa.Middleware;
    authenticate(strategy: string, options: Object, callback?: Function): Koa.Middleware;
    authenticate(strategies: string[], callback?: Function): Koa.Middleware;
    authenticate(strategies: string[], options: Object, callback?: Function): Koa.Middleware;
    authorize(strategy: string, callback?: Function): Koa.Middleware;
    authorize(strategy: string, options: Object, callback?: Function): Koa.Middleware;
    authorize(strategies: string[], callback?: Function): Koa.Middleware;
    authorize(strategies: string[], options: Object, callback?: Function): Koa.Middleware;
    serializeUser(fn: (user: any, done: (err: any, id: any) => void) => void): void;
    deserializeUser(fn: (id: any, done: (err: any, user: any) => void) => void): void;
    transformAuthInfo(fn: (info: any, done: (err: any, info: any) => void) => void): void;
}
export interface Strategy {
    name?: string;
    authenticate(req: express.Request, options?: Object): void;
}
export interface Profile {
    provider: string;
    id: string;
    displayName: string;
    name?: Array<{
        familyName: string;
        givenName: string;
        middleName?: string;
    }>;
    emails?: Array<{
        value: string;
        type?: string;
    }>;
    photos?: Array<{
        value: string;
    }>;
}
export interface Framework {
    initialize(passport: Passport, options?: Object): Function;
    authenticate(passport: Passport, name: string, options?: Object, callback?: Function): Function;
    authorize?(passport: Passport, name: string, options?: Object, callback?: Function): Function;
}
declare var _default: Passport;
export default _default;
export declare const STRATEGY_NAME = "provider";
