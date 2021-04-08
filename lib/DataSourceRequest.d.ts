import { DataSourceAggregationField, DataSourceArgumentMap } from "./DataSource";
export declare enum DataSourceOperation {
    list = "list",
    create = "create",
    read = "read",
    update = "update",
    delete = "delete"
}
export declare enum SortInfoOrder {
    ascend = "ascend",
    descend = "descend"
}
export interface SortInfo {
    columnKey: string;
    order: SortInfoOrder;
}
export declare class DataSourceRequest {
    name: string;
    url: string;
    operation: DataSourceOperation;
    offset: number;
    limit?: number;
    fields: {
        [key: string]: string;
    };
    aggregations: DataSourceAggregationField[];
    filters: {
        [key: string]: DataSourceArgumentMap;
    };
    search?: string;
    sorting: SortInfo[];
    id?: string | number;
    data?: any;
    arguments?: {
        [key: string]: string;
    };
    constructor(variables?: any);
}
