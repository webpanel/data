export declare enum DataSourceOperation {
    list = "list",
    create = "create",
    read = "read",
    update = "update",
    delete = "delete",
}
export interface SortAttribute {
    name: string;
    sort: 'asc' | 'desc';
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
    filters: {
        [key: string]: string;
    };
    sorting: string[];
    id?: string | number;
    data?: any;
    arguments?: {
        [key: string]: string;
    };
    constructor(variables?: any);
}
