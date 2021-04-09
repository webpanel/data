import { DataSourceOperation } from "../DataSourceRequest";
export interface ResourceResponse {
    data: any;
}
export interface ResourceCollectionResponse {
    items: any[];
    aggregations: {
        [key: string]: any;
    };
    count: number;
}
export declare class ResponseDataTransformer {
    handle(operation: DataSourceOperation, data: any): Promise<any>;
    list(data: any): Promise<ResourceCollectionResponse>;
    create(data: any): Promise<ResourceResponse>;
    read(data: any): Promise<ResourceResponse>;
    update(data: any): Promise<ResourceResponse>;
    delete(data: any): Promise<ResourceResponse>;
}
