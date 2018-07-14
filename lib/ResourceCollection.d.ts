import { ResourceBase, ResourceBaseConfig } from './ResourceBase';
import { DataSourceArgumentMap } from './DataSource';
export interface SortInfo {
    columnKey: string;
    order: 'ascend' | 'descend';
}
export interface ResourceCollectionConfig extends ResourceBaseConfig {
    filters?: DataSourceArgumentMap;
    sorting?: SortInfo[];
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
    updateFilters(filters: DataSourceArgumentMap): Promise<void>;
    updateSorting(sorting: SortInfo[]): Promise<void>;
    updateOffset(offset: number): Promise<void>;
    updateLimit(limit: number): Promise<void>;
}
