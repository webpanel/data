import { ResourceBase, ResourceBaseConfig } from './ResourceBase';
import { DataSourceArgumentMap } from './DataSource';
import { Resource } from './Resource';
import { SortInfo } from './DataSourceRequest';
export interface ResourceCollectionConfig extends ResourceBaseConfig {
    autopersistConfigKey?: string;
    initialFilters?: DataSourceArgumentMap;
    initialSearch?: string;
    initialSorting?: SortInfo[];
    initialOffset?: number;
    initialLimit?: number;
}
export declare class ResourceCollection extends ResourceBase<any[] | null> {
    count: number | undefined;
    filters?: {
        [key: string]: DataSourceArgumentMap;
    };
    search?: string;
    sorting?: any;
    offset?: number;
    limit?: number;
    autopersistConfigKey?: string;
    constructor(config: ResourceCollectionConfig);
    private autopersistConfig;
    get: () => Promise<void>;
    delete: (id: import("csstype").AnimationIterationCountProperty) => Promise<any>;
    getItem: (props: {
        id: import("csstype").AnimationIterationCountProperty;
        args?: {
            [key: string]: any;
        } | undefined;
        autoload?: boolean | undefined;
    }) => Resource;
    updateFilters(filters?: DataSourceArgumentMap, autoreload?: boolean, autopersist?: boolean): Promise<void>;
    updateNamedFilters(key: string, filters?: DataSourceArgumentMap, autoreload?: boolean, autopersist?: boolean): Promise<void>;
    namedFilter(key: string): DataSourceArgumentMap | undefined;
    updateSearch(search?: string, autoreload?: boolean): Promise<void>;
    updateSorting(sorting?: SortInfo[], autoreload?: boolean): Promise<void>;
    updateOffset(offset?: number, autoreload?: boolean): Promise<void>;
    updateLimit(limit?: number, autoreload?: boolean): Promise<void>;
    readonly page: number;
}
