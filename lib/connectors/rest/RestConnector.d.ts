import { HTTPRequest, HTTPResponse, ConnectorError } from '../Connector';
import { HTTPConnector } from '../HTTPConnector';
import { DataSourceRequest, DataSourceOperation } from '../../DataSourceRequest';
export declare class RestConnectorError extends ConnectorError {
    status: number;
    response: HTTPResponse;
    constructor(response: HTTPResponse, message?: string | undefined);
}
export declare class RestConnector extends HTTPConnector {
    protected sendHttpRequest(request: HTTPRequest): Promise<HTTPResponse>;
    transformRequest(request: DataSourceRequest): HTTPRequest;
    methodForOperation(operation: DataSourceOperation): string;
}
