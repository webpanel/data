import { ResourceBase, ResourceBaseConfig } from './ResourceBase';
import { DataSourceArgumentMap } from './DataSource';
export interface ResourceCollectionConfig extends ResourceBaseConfig {
    filters?: DataSourceArgumentMap;
    sorting?: string[];
    offset?: number;
    limit?: number;
}
export declare class ResourceCollection extends ResourceBase<any[] | null> {
    count: number | undefined;
    filters?: any;
    sorting?: any;
    offset?: number;
    limit?: number;
    constructor(config: ResourceCollectionConfig);
    get: () => Promise<void>;
    delete: (id: string | number) => Promise<any>;
}
