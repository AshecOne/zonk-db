declare const _default: () => {
    port: number;
    database: {
        uri: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    google: {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
    };
    redis: {
        host: string;
        port: number;
    };
};
export default _default;
