import { ResourceBase, ResourceBaseConfig } from './ResourceBase';
declare type ResourceID = string | number;
export interface ResourceConfig extends ResourceBaseConfig {
    id?: ResourceID;
    defaultValues?: {
        [key: string]: any;
    };
    onCreate?: ((id: ResourceID, values: {
        [key: string]: any;
    }) => void);
    onUpdate?: ((values: {
        [key: string]: any;
    }) => void);
}
export declare class Resource extends ResourceBase<any | null> {
    id?: ResourceID;
    onCreate?: ((id: ResourceID, values: {
        [key: string]: any;
    }) => void);
    onUpdate?: ((values: {
        [key: string]: any;
    }) => void);
    constructor(config: ResourceConfig);
    tryWithLoading(p: Promise<any>): Promise<any>;
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
export {};
