import { HTTPRequest, HTTPResponse } from '../Connector';
import { HTTPConnector } from '../HTTPConnector';
import { DataSourceOperation } from '../../DataSourceRequest';
export declare class RestConnectorError extends Error {
    status: number;
    response: HTTPResponse;
    constructor(status: number, response: HTTPResponse, message?: string | undefined);
}
export declare class RestConnector extends HTTPConnector {
    send(req: HTTPRequest): Promise<HTTPResponse>;
    methodForOperation(op: DataSourceOperation): string;
}
