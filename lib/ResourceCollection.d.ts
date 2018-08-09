import { ResourceBase, ResourceBaseConfig } from './ResourceBase';
import { DataSourceArgumentMap } from './DataSource';
import { SortInfo } from './DataSourceRequest';
import { Resource } from './Resource';
export interface ResourceCollectionConfig extends ResourceBaseConfig {
    filters?: DataSourceArgumentMap;
    search?: string;
    sorting?: SortInfo[];
    offset?: number;
    limit?: number;
}
export declare class ResourceCollection extends ResourceBase<any[] | null> {
    count: number | undefined;
    filters?: DataSourceArgumentMap;
    search?: string;
    sorting?: any;
    offset?: number;
    limit?: number;
    constructor(config: ResourceCollectionConfig);
    get: () => Promise<void>;
    delete: (id: string | number) => Promise<any>;
    getItem: (props: {
        id: string | number;
        args?: {
            [key: string]: any;
        } | undefined;
        autoload?: boolean | undefined;
    }) => Resource;
    updateFilters(filters: DataSourceArgumentMap, autoreload?: boolean): Promise<void>;
    updateSearch(search?: string, autoreload?: boolean): Promise<void>;
    updateSorting(sorting: SortInfo[], autoreload?: boolean): Promise<void>;
    updateOffset(offset: number, autoreload?: boolean): Promise<void>;
    updateLimit(limit: number, autoreload?: boolean): Promise<void>;
}
