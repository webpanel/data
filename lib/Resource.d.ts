import { ResourceBase, ResourceBaseConfig } from './ResourceBase';
declare type ResourceID = string | number;
export interface ResourceConfig extends ResourceBaseConfig {
    id?: ResourceID;
    initialValues?: {
        [key: string]: any;
    };
    onCreate?: (id: ResourceID, values: {
        [key: string]: any;
    }) => void;
    onUpdate?: (values: {
        [key: string]: any;
    }) => void;
}
export declare class Resource extends ResourceBase<any | null> {
    id?: ResourceID;
    onCreate?: (id: ResourceID, values: {
        [key: string]: any;
    }) => void;
    onUpdate?: (values: {
        [key: string]: any;
    }) => void;
    private updatingHash;
    private patchHash;
    constructor(config: ResourceConfig);
    tryWithLoading(p: Promise<any>): Promise<any>;
    getIfHasID: () => Promise<any>;
    get: () => Promise<any>;
    create: (values: {
        [key: string]: any;
    }) => Promise<any>;
    update: (values: {
        [key: string]: any;
    }) => Promise<void>;
    put: (values: {
        [key: string]: any;
    }) => Promise<any>;
    updateValues: (props: {
        values: {
            [key: string]: any;
        };
        fields?: string[] | undefined;
    }) => Promise<any>;
    patch: (values: {
        [key: string]: any;
    }, props?: {
        fields?: string[] | undefined;
    } | undefined) => Promise<any>;
    delete: () => Promise<any>;
    isPersisted: () => boolean;
    save: (values: {
        [key: string]: any;
    }) => Promise<any>;
}
export {};
