export declare class HTTPRequest {
    url: string;
    method: string;
    data: any;
    headers: {
        [key: string]: string;
    };
    constructor(variables?: any);
}
