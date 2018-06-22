export declare class HTTPResponse {
    status: number;
    data: any;
    dataGetter: (res: HTTPResponse) => any;
    constructor(data: any);
    getData(): any;
}
