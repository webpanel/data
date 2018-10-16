import { DataSource } from './DataSource';
export interface ResourceBaseConfig {
    dataSource: DataSource;
    name: string;
    fields?: string[];
    initialArgs?: {
        [key: string]: any;
    };
}
export declare class ResourceBase<T> {
    name: string;
    dataSource: DataSource;
    fields?: string[];
    arguments?: {
        [key: string]: any;
    };
    loading: boolean;
    data: T | undefined;
    error: Error | undefined;
    constructor(config: ResourceBaseConfig);
    getRawData(): T | undefined;
}
