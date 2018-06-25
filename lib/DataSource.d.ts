import { Connector } from './connectors/Connector';
import { DataSourceOperation } from './DataSourceRequest';
import { ResourceCollectionResponse, ResourceResponse } from './connectors/ResponseDataTransformer';
export declare type DataSourceArgumentType = DataSourceArgumentMap | string | number | null;
export interface DataSourceArgumentMap {
    [key: string]: DataSourceArgumentType | DataSourceArgumentType[];
}
export declare class DataSource {
    name: string;
    connector: Connector;
    url: string;
    constructor(name: string, connector: Connector, url: string);
    list(name: string, fields: string[]): Promise<any>;
    create(name: string, data: {
        [key: string]: string;
    }, fields: string[]): Promise<any>;
    read(name: string, id: string | number | undefined, fields: string[]): Promise<any>;
    update(name: string, id: string | number, data: {
        [key: string]: string;
    }, fields: string[]): Promise<any>;
    delete(name: string, id: string | number, fields: string[]): Promise<any>;
    send(params: {
        operation: DataSourceOperation;
        name: string;
        fields: string[];
        id?: string | number;
        data?: any;
    }): Promise<ResourceResponse | ResourceCollectionResponse | null>;
}
