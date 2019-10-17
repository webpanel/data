import { DataSourceRequest, HTTPRequest, HTTPResponse, ResourceCollectionResponse, ResourceResponse } from '../../connectors/Connector';
import { SortInfoValue } from './GraphQLQuery';
import { SortInfo } from '../../DataSourceRequest';
import { HTTPConnector } from '../HTTPConnector';
export declare type GraphQLFieldSource = {
    [key: string]: any;
} | string;
export declare type GraphQLFieldSourceMap = GraphQLFieldSource | GraphQLFieldSource[];
export declare class GraphQLConnector extends HTTPConnector {
    filterInputTypeName(request: DataSourceRequest): string;
    transformFilterObject(request: DataSourceRequest): {
        [key: string]: any;
    };
    sortInputTypeName(request: DataSourceRequest): string;
    inputTypeName(request: DataSourceRequest): string;
    sortFormatName(sort: SortInfo): SortInfoValue;
    protected sendHttpRequest(request: HTTPRequest): Promise<HTTPResponse>;
    transformResponse(response: HTTPResponse, request: DataSourceRequest): Promise<ResourceResponse | ResourceCollectionResponse | null>;
    fetchFieldNameForRequest(request: DataSourceRequest): string;
    transformRequest(request: DataSourceRequest): HTTPRequest;
    generateQueryParams(request: DataSourceRequest, args: object): string;
    transformData(res: HTTPResponse, request: DataSourceRequest): any;
    private fillFieldsFromObject;
    private fieldForOperation;
}
