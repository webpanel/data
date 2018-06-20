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
