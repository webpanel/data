import { Connector, DataSourceRequest, HTTPRequest, HTTPResponse } from "./Connector";
import { ResourceCollectionResponse, ResourceResponse, ResponseDataTransformer } from "./ResponseDataTransformer";
import { ThunkAsync } from "ts-thunk";
export interface HTTPConnectorConfiguration {
    responseDataTransformer?: ResponseDataTransformer;
    headers?: ThunkAsync<{
        [key: string]: string;
    }>;
}
export declare class HTTPConnector implements Connector {
    private config;
    responseTransformer: ResponseDataTransformer;
    constructor(config?: HTTPConnectorConfiguration);
    protected sendHttpRequest(request: HTTPRequest): Promise<HTTPResponse>;
    getErrorMessageFromResponse(res: HTTPResponse): string;
    protected transformRequest(request: DataSourceRequest): HTTPRequest;
    protected transformResponse(response: HTTPResponse, request: DataSourceRequest): Promise<ResourceResponse | ResourceCollectionResponse | null>;
    send(request: DataSourceRequest): Promise<ResourceResponse | ResourceCollectionResponse | null>;
}
