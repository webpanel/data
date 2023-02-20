import { ResourceBase, ResourceBaseConfig, ResourceBaseOptions } from "./ResourceBase";
export declare type ResourceID = string | number;
export interface ResourceOptions<T> extends ResourceBaseOptions<T, Resource<T>> {
    id?: ResourceID;
    initialValues?: T;
    onCreate?: (id: ResourceID, values: T) => void;
    onUpdate?: (values: Partial<T>) => void;
    onDelete?: (values: T) => void;
}
export declare type ResourceConfig<T> = ResourceOptions<T> & ResourceBaseConfig;
export declare class Resource<T = {
    [key: string]: any;
}, C extends ResourceConfig<T> = ResourceConfig<T>> extends ResourceBase<T> {
    id?: ResourceID;
    onCreate?: (id: ResourceID, values: T) => void;
    onUpdate?: (values: Partial<T>) => void;
    onDelete?: (values: T) => void;
    private updatingHash;
    private patchHash;
    constructor(config: C);
    getIfHasID: () => Promise<any>;
    get: () => Promise<any>;
    create: (values: T) => Promise<any>;
    update: (values: T) => Promise<any>;
    put: (values: T) => Promise<any>;
    updateValues: (props: {
        values: Partial<T>;
        fields?: string[] | undefined;
    }) => Promise<any>;
    patch: (values: Partial<T>, props?: {
        fields?: string[] | undefined;
    } | undefined) => Promise<any>;
    delete: () => Promise<any>;
    isPersisted: () => boolean;
    save: (values: T) => Promise<any>;
}
