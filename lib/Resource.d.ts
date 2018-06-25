import { ResourceBase, ResourceBaseConfig } from './ResourceBase';
export interface ResourceConfig extends ResourceBaseConfig {
    id?: string | number;
    defaultValues?: {
        [key: string]: any;
    };
}
export declare class Resource extends ResourceBase<any | null> {
    id?: string | number;
    constructor(config: ResourceConfig);
    getIfHasID: () => Promise<any>;
    get: () => Promise<any>;
    create: (values: {
        [key: string]: any;
    }) => Promise<any>;
    update: (values: {
        [key: string]: any;
    }) => Promise<any>;
    delete: () => Promise<any>;
    isPersisted: () => boolean;
    save: (values: {
        [key: string]: any;
    }) => Promise<any>;
}
