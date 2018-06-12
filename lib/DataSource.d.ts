import { GraphQLConnector } from './utils/networking/GraphQLConnector';
import { GraphQLField, GraphQLArgumentMap } from './utils/networking/GraphQLQuery';
export declare enum DataSourceOperation {
    list = "list",
    create = "create",
    read = "read",
    update = "update",
    delete = "delete",
}
export declare type GraphQLFieldSource = {
    [key: string]: any;
} | string;
export declare type GraphQLFieldSourceMap = GraphQLFieldSource | GraphQLFieldSource[];
export declare type DataSourceTypes = 'graphql';
export declare class DataSource {
    name: string;
    type: DataSourceTypes;
    url: string;
    constructor(name: string, type: DataSourceTypes, url: string);
    getConnector(): GraphQLConnector;
    list(name: string, fields: string[], args: {
        [key: string]: any;
    }): Promise<any>;
    create(name: string, data: {
        [key: string]: string;
    }, fields: string[]): Promise<any>;
    read(name: string, id: string | number | undefined, fields: string[], args?: {
        [key: string]: any;
    }): Promise<any>;
    update(name: string, id: string | number, data: {
        [key: string]: string;
    }, fields: string[]): Promise<any>;
    delete(name: string, id: string | number, fields: string[]): Promise<any>;
    fillFieldsFromObject(field: GraphQLField, obj: GraphQLFieldSourceMap): void;
    fieldForOperation(operation: DataSourceOperation, fetchFieldName: string, fields: GraphQLFieldSourceMap, args?: GraphQLArgumentMap): GraphQLField;
    send(operation: DataSourceOperation, name: string, fields: string[], args?: GraphQLArgumentMap): Promise<any>;
}
