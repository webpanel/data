import { Connector, DataSourceRequest, HTTPRequest, HTTPResponse } from './Connector';
import { ResourceCollectionResponse, ResourceResponse, ResponseDataTransformer } from './ResponseDataTransformer';
export interface HTTPConnectorConfiguration {
    responseDataTransformer?: ResponseDataTransformer;
}
export declare class HTTPConnector implements Connector {
    responseTransformer: ResponseDataTransformer;
    constructor(config?: HTTPConnectorConfiguration);
    protected sendHttpRequest(request: HTTPRequest): Promise<HTTPResponse>;
    getErrorMessageFromResponse(res: HTTPResponse): string;
    protected transformRequest(request: DataSourceRequest): HTTPRequest;
    protected transformResponse(response: HTTPResponse, request: DataSourceRequest): Promise<ResourceResponse | ResourceCollectionResponse | null>;
    send(request: DataSourceRequest): Promise<ResourceResponse | ResourceCollectionResponse | null>;
}
