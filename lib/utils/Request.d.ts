export declare class Request {
    url: string;
    data: any;
    page: number | null;
    limit: number | null;
    fields: {
        [key: string]: string;
    };
    filters: {
        [key: string]: string;
    };
    headers: {
        [key: string]: string;
    };
    sorting: string[];
    params: string[];
    constructor(variables?: any);
    getPage(pageCursor: number): Request;
    field(variable: string, value: string): Request;
    withFields(fields: {
        [key: string]: string;
    }): Request;
    filter(variable: string, value: string): Request;
    withFilters(filters: {
        [key: string]: string;
    }): Request;
    paginate(limit: number | null): Request;
    sort(array: string[]): Request;
    withParams(params: string[]): Request;
}
