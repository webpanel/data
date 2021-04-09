import { Connector } from "./connectors/Connector";
import { ResourceCollectionResponse, ResourceResponse } from "./connectors/ResponseDataTransformer";
import { DataSourceOperation } from "./DataSourceRequest";
export declare type DataSourceArgumentType = DataSourceArgumentMap | string | number | boolean | null | undefined;
export declare type DataSourceAggregationFunction = "MIN" | "MAX" | "AVG" | "SUM";
export interface DataSourceAggregationField {
    name: string;
    function: DataSourceAggregationFunction;
}
export interface DataSourceArgumentMap {
    [key: string]: DataSourceArgumentType | DataSourceArgumentType[];
}
export interface DataSourceArgumentOptions {
    onAuthorizationError?: (error: Error) => void;
}
export declare class DataSource {
    private options?;
    name: string;
    connector: Connector;
    url: string;
    constructor(name: string, connector: Connector, url: string, options?: DataSourceArgumentOptions | undefined);
    list(name: string, fields?: string[], aggregations?: DataSourceAggregationField[], filters?: {
        [key: string]: DataSourceArgumentMap;
    }, search?: string, sorting?: string[], offset?: number, limit?: number, args?: DataSourceArgumentMap): Promise<any>;
    create(name: string, data: any, fields?: string[], args?: DataSourceArgumentMap): Promise<any>;
    read(name: string, id: string | number | undefined, fields?: string[], args?: DataSourceArgumentMap): Promise<any>;
    update(name: string, id: string | number, data: any, fields?: string[], args?: DataSourceArgumentMap): Promise<any>;
    delete(name: string, id: string | number, fields?: string[], args?: DataSourceArgumentMap): Promise<any>;
    send(params: {
        operation: DataSourceOperation;
        name: string;
        fields?: string[];
        id?: string | number;
        data?: any;
        aggregations?: DataSourceAggregationField[];
        filters?: {
            [key: string]: DataSourceArgumentMap;
        };
        search?: string;
        sorting?: string[];
        offset?: number;
        limit?: number;
        args?: DataSourceArgumentMap;
    }): Promise<ResourceResponse | ResourceCollectionResponse | null>;
}
