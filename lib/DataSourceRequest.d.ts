export declare enum DataSourceOperation {
    list = "list",
    create = "create",
    read = "read",
    update = "update",
    delete = "delete",
}
export declare class DataSourceRequest {
    name: string;
    url: string;
    operation: DataSourceOperation;
    page: number | null;
    limit: number | null;
    fields: {
        [key: string]: string;
    };
    filters: {
        [key: string]: string;
    };
    sorting: string[];
    id?: string | number;
    data?: any;
    constructor(variables?: any);
    getPage(pageCursor: number): DataSourceRequest;
    field(variable: string, value: string): DataSourceRequest;
    withFields(fields: {
        [key: string]: string;
    }): DataSourceRequest;
    filter(variable: string, value: string): DataSourceRequest;
    withFilters(filters: {
        [key: string]: string;
    }): DataSourceRequest;
    paginate(limit: number | null): DataSourceRequest;
    sort(array: string[]): DataSourceRequest;
}
