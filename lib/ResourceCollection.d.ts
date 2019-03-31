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
    initialConfig: ResourceCollectionConfig;
    autopersistConfigKey?: string;
    hasFilterChanges: boolean;
    constructor(config: ResourceCollectionConfig);
    private autopersistConfig;
    get: () => Promise<void>;
    delete: (id: string | number) => Promise<any>;
    getItem: (props: {
        id: string | number;
        args?: {
            [key: string]: any;
        } | undefined;
        autoload?: boolean | undefined;
    }) => Resource;
    setInitialValues: (values: ResourceCollectionConfig) => void;
    resetFilters: () => void;
    resetPagination: () => void;
    updateFilters(filters?: DataSourceArgumentMap, autoreload?: boolean, autopersist?: boolean): Promise<void>;
    updateNamedFilters(key: string, filters?: DataSourceArgumentMap, autoreload?: boolean, autopersist?: boolean): Promise<void>;
    namedFilter(key: string): DataSourceArgumentMap | undefined;
    updateSearch(search?: string, autoreload?: boolean): Promise<void>;
    updateSorting(sorting?: SortInfo[], autoreload?: boolean): Promise<void>;
    updateOffset(offset?: number, autoreload?: boolean): Promise<void>;
    updateLimit(limit?: number, autoreload?: boolean): Promise<void>;
    readonly page: number;
}
