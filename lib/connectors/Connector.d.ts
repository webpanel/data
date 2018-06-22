export { ConnectorError, isConnectorError } from './ConnectorError';
export { DataSourceRequest, DataSourceOperation } from '../DataSourceRequest';
export { HTTPResponse } from '../utils/HTTPResponse';
export { HTTPRequest } from '../utils/HTTPRequest';
import { HTTPRequest } from '../utils/HTTPRequest';
import { HTTPResponse } from '../utils/HTTPResponse';
import { DataSourceRequest } from '../DataSourceRequest';
export interface Connector {
    send(req: HTTPRequest): Promise<HTTPResponse>;
    transformRequest(request: DataSourceRequest): HTTPRequest;
    transformData(response: HTTPResponse, request: DataSourceRequest): any;
}
