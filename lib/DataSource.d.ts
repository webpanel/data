import { Connector } from './connectors/Connector';
import { ResourceCollectionResponse, ResourceResponse } from './connectors/ResponseDataTransformer';
import { DataSourceOperation } from './DataSourceRequest';
export declare type DataSourceArgumentType = DataSourceArgumentMap | string | number | null;
export interface DataSourceArgumentMap {
    [key: string]: DataSourceArgumentType | DataSourceArgumentType[];
}
export declare class DataSource {
    name: string;
    connector: Connector;
    url: string;
    constructor(name: string, connector: Connector, url: string);
    list(name: string, fields?: string[], filters?: {
        [key: string]: DataSourceArgumentMap;
    }, search?: string, sorting?: string[], offset?: number, limit?: number, args?: DataSourceArgumentMap): Promise<any>;
    create(name: string, data: {
        [key: string]: string;
    }, fields?: string[], args?: DataSourceArgumentMap): Promise<any>;
    read(name: string, id: string | number | undefined, fields?: string[], args?: DataSourceArgumentMap): Promise<any>;
    update(name: string, id: string | number, data: {
        [key: string]: string;
    }, fields?: string[], args?: DataSourceArgumentMap): Promise<any>;
    delete(name: string, id: string | number, fields?: string[], args?: DataSourceArgumentMap): Promise<any>;
    send(params: {
        operation: DataSourceOperation;
        name: string;
        fields?: string[];
        id?: string | number;
        data?: any;
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
