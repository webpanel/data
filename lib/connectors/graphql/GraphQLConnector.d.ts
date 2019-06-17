import { DataSourceRequest, HTTPRequest, HTTPResponse, ResourceCollectionResponse, ResourceResponse } from '../../connectors/Connector';
import { HTTPConnector } from '../HTTPConnector';
export declare type GraphQLFieldSource = {
    [key: string]: any;
} | string;
export declare type GraphQLFieldSourceMap = GraphQLFieldSource | GraphQLFieldSource[];
export declare class GraphQLConnector extends HTTPConnector {
    filterInputTypeName(request: DataSourceRequest): string;
    sortInputTypeName(request: DataSourceRequest): string;
    inputTypeName(request: DataSourceRequest): string;
    protected sendHttpRequest(request: HTTPRequest): Promise<HTTPResponse>;
    transformResponse(response: HTTPResponse, request: DataSourceRequest): Promise<ResourceResponse | ResourceCollectionResponse | null>;
    fetchFieldNameForRequest(request: DataSourceRequest): string;
    transformRequest(request: DataSourceRequest): HTTPRequest;
    generateQueryParams(request: DataSourceRequest, args: object): string;
    transformData(res: HTTPResponse, request: DataSourceRequest): any;
    private fillFieldsFromObject;
    private fieldForOperation;
}
