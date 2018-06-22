import { Connector, HTTPResponse, HTTPRequest, DataSourceRequest } from './Connector';
export declare class HTTPConnector implements Connector {
    send(req: HTTPRequest): Promise<HTTPResponse>;
    transformRequest(request: DataSourceRequest): HTTPRequest;
    transformData(res: HTTPResponse, request: DataSourceRequest): any;
}
