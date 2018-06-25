import { HTTPRequest, HTTPResponse } from '../Connector';
import { HTTPConnector } from '../HTTPConnector';
import { DataSourceRequest, DataSourceOperation } from '../../DataSourceRequest';
export declare class RestConnectorError extends Error {
    status: number;
    response: HTTPResponse;
    constructor(status: number, response: HTTPResponse, message?: string | undefined);
}
export declare class RestConnector extends HTTPConnector {
    protected sendHttpRequest(request: HTTPRequest): Promise<HTTPResponse>;
    transformRequest(request: DataSourceRequest): HTTPRequest;
    methodForOperation(operation: DataSourceOperation): string;
}
