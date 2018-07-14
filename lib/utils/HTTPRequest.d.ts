export declare class HTTPRequest {
    url: string;
    querystring: {
        [key: string]: any;
    };
    method: string;
    data: any;
    headers: {
        [key: string]: string;
    };
    constructor(variables?: any);
    getUrl(): string;
    addParam(key: string, value: any): void;
}
