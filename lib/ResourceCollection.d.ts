import { ResourceBase, ResourceBaseConfig } from './ResourceBase';
export interface ResourceCollectionConfig extends ResourceBaseConfig {
    filter?: any;
    sorting?: any;
    page?: number;
}
export declare class ResourceCollection extends ResourceBase<any[] | null> {
    count: number | undefined;
    constructor(config: ResourceCollectionConfig);
    get: () => Promise<void>;
}
