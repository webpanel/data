import { HTTPRequest, HTTPResponse, DataSourceRequest, DataSourceOperation } from '../../connectors/Connector';
import { GraphQLField, GraphQLArgumentMap } from './GraphQLQuery';
import { HTTPConnector } from '../HTTPConnector';
export declare type GraphQLFieldSource = {
    [key: string]: any;
} | string;
export declare type GraphQLFieldSourceMap = GraphQLFieldSource | GraphQLFieldSource[];
export declare class GraphQLConnector extends HTTPConnector {
    send(req: HTTPRequest): Promise<HTTPResponse>;
    transformRequest(request: DataSourceRequest): HTTPRequest;
    fillFieldsFromObject(field: GraphQLField, obj: GraphQLFieldSourceMap): void;
    fieldForOperation(operation: DataSourceOperation, fetchFieldName: string, fields: GraphQLFieldSourceMap, args?: GraphQLArgumentMap): GraphQLField;
}
