import { Connector, IConnector } from './connectors/Connector';
import { HTTPResponse } from './utils/HTTPResponse';
import { DataSourceOperation } from './DataSourceRequest';
export declare type DataSourceArgumentType = DataSourceArgumentMap | string | number | null;
export interface DataSourceArgumentMap {
    [key: string]: DataSourceArgumentType | DataSourceArgumentType[];
}
export declare class DataSource {
    name: string;
    connector: Connector;
    url: string;
    constructor(name: string, connector: IConnector, url: string);
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
    }): Promise<HTTPResponse | null>;
}
