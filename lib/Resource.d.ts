import { DataSource } from './DataSource';
export interface ResourceConfig {
    id?: string | number;
    dataSource: DataSource;
    name: string;
    fields: string[];
    args?: {
        [key: string]: any;
    };
    defaultValues?: {
        [key: string]: any;
    };
}
export declare class Resource {
    id?: string | number;
    name: string;
    dataSource: DataSource;
    fields: string[];
    args?: {
        [key: string]: any;
    };
    loading: boolean;
    data: any | null;
    constructor(config: ResourceConfig);
    getIfHasID: () => Promise<void>;
    get: () => Promise<void>;
    create: (values: {
        [key: string]: any;
    }) => Promise<void>;
    update: (values: {
        [key: string]: any;
    }) => Promise<void>;
    delete: () => Promise<void>;
    isPersisted: () => boolean;
    save: (values: {
        [key: string]: any;
    }) => Promise<void>;
}
