export declare let CONFIG: {
    port: number;
    mongo: {
        host: string;
        name: string;
        port: number;
    };
    redis: {
        port: number;
        host: string;
    };
    oauth2: {
        authorizationURL: string;
        tokenURL: string;
        callbackURL: string;
        clientID: string;
        clientSecret: string;
        scope: string[];
    };
};
export declare function initAll(): Promise<void>;
