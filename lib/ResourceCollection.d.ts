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
export declare class ResourceCollection<T = any[] | null, C extends ResourceCollectionConfig = ResourceCollectionConfig> extends ResourceBase<T> {
    count: number | undefined;
    filters?: {
        [key: string]: DataSourceArgumentMap;
    };
    search?: string;
    sorting?: any;
    offset?: number;
    limit?: number;
    initialConfig: C;
    autopersistConfigKey?: string;
    hasFilterChanges: boolean;
    private loadingHash;
    constructor(config: C);
    private autopersistConfig;
    get: () => Promise<void>;
    reload: () => Promise<void>;
    delete: (id: string | number) => Promise<any>;
    getItem: (props: {
        id: string | number;
        args?: {
            [key: string]: any;
        } | undefined;
        autoload?: boolean | undefined;
    }) => Resource<{
        [key: string]: any;
    }, import("./Resource").ResourceConfig<{
        [key: string]: any;
    }>>;
    setInitialValues: (values: ResourceCollectionConfig) => void;
    resetFilters: () => void;
    resetPagination: () => void;
    updateFilters: (filters?: DataSourceArgumentMap | undefined, autoreload?: boolean, autopersist?: boolean) => Promise<void>;
    updateNamedFilters: (key: string, filters?: DataSourceArgumentMap | undefined, autoreload?: boolean, autopersist?: boolean) => Promise<void>;
    namedFilter: (key: string) => DataSourceArgumentMap | undefined;
    updateSearch: (search?: string | undefined, autoreload?: boolean) => Promise<void>;
    updateSorting: (sorting?: SortInfo[] | undefined, autoreload?: boolean) => Promise<void>;
    updateOffset: (offset?: number | undefined, autoreload?: boolean) => Promise<void>;
    updateLimit: (limit?: number | undefined, autoreload?: boolean) => Promise<void>;
    readonly page: number;
}
