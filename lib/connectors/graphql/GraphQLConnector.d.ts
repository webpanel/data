import { HTTPRequest, HTTPResponse, DataSourceRequest, ResourceResponse, ResourceCollectionResponse } from '../../connectors/Connector';
import { HTTPConnector } from '../HTTPConnector';
export declare type GraphQLFieldSource = {
    [key: string]: any;
} | string;
export declare type GraphQLFieldSourceMap = GraphQLFieldSource | GraphQLFieldSource[];
export declare class GraphQLConnector extends HTTPConnector {
    transformResponse(response: HTTPResponse, request: DataSourceRequest): Promise<ResourceResponse | ResourceCollectionResponse | null>;
    transformRequest(request: DataSourceRequest): HTTPRequest;
    transformData(res: HTTPResponse, request: DataSourceRequest): any;
    private fillFieldsFromObject(field, obj);
    private fieldForOperation(operation, fetchFieldName, fields, args?);
}
