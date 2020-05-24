import { ResourceBase, ResourceBaseConfig, ResourceBaseOptions } from "./ResourceBase";
import { DataSourceArgumentMap } from "./DataSource";
import { Resource, ResourceID } from "./Resource";
import { SortInfo } from "./DataSourceRequest";
export interface ResourceCollectionOptions<T> extends ResourceBaseOptions<T[]> {
    autopersistConfigKey?: string;
    initialFilters?: DataSourceArgumentMap;
    initialSearch?: string;
    initialSorting?: SortInfo[];
    initialOffset?: number;
    initialLimit?: number;
}
export declare type ResourceCollectionConfig<T> = ResourceBaseConfig & ResourceCollectionOptions<T>;
export declare class ResourceCollection<T extends {
    id: ResourceID;
}, C extends ResourceCollectionConfig<T> = ResourceCollectionConfig<T>> extends ResourceBase<T[]> {
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
    }) => Resource;
    patchItemValues(id: ResourceID, values: Partial<T>): Promise<Resource>;
    setInitialValues: (values: ResourceCollectionConfig<T>) => void;
    resetFilters: () => void;
    resetPagination: () => void;
    updateFilters: (filters?: DataSourceArgumentMap | undefined, autoreload?: boolean, autopersist?: boolean) => Promise<void>;
    updateNamedFilters: (key: string, filters?: DataSourceArgumentMap | undefined, autoreload?: boolean, autopersist?: boolean) => Promise<void>;
    namedFilter: (key: string) => DataSourceArgumentMap | undefined;
    updateSearch: (search?: string | undefined, autoreload?: boolean) => Promise<void>;
    updateSorting: (sorting?: SortInfo[] | undefined, autoreload?: boolean) => Promise<void>;
    updateOffset: (offset?: number | undefined, autoreload?: boolean) => Promise<void>;
    updateLimit: (limit?: number | undefined, autoreload?: boolean) => Promise<void>;
    get page(): number;
}
