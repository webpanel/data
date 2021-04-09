import {
  DataSourceAggregationField,
  DataSourceArgumentMap,
} from "./DataSource";
import { Resource, ResourceID } from "./Resource";
import {
  ResourceBase,
  ResourceBaseConfig,
  ResourceBaseOptions,
} from "./ResourceBase";

import { SortInfo } from "./DataSourceRequest";

export interface ResourceCollectionOptions<T> extends ResourceBaseOptions<T[]> {
  autopersistConfigKey?: string;

  aggregations?: DataSourceAggregationField[];
  initialFilters?: DataSourceArgumentMap;
  initialSearch?: string;
  initialSorting?: SortInfo[];
  initialOffset?: number;
  initialLimit?: number;
}

export type ResourceCollectionConfig<T> = ResourceBaseConfig &
  ResourceCollectionOptions<T>;

export class ResourceCollection<
  T extends { id: ResourceID },
  C extends ResourceCollectionConfig<T> = ResourceCollectionConfig<T>
> extends ResourceBase<T[]> {
  count: number | undefined = undefined;
  aggregations?: { [key: string]: any };
  filters?: { [key: string]: DataSourceArgumentMap };
  search?: string;
  sorting?: any;
  offset?: number;
  limit?: number;

  initialConfig: C;
  autopersistConfigKey?: string;

  hasFilterChanges: boolean = false;

  // this hash is used to simulate "cancelling" behaviour of loading requests
  // it's compared with the latest generated requst hash to make sure that resource collection displays only latest loading request
  // this is required in case of multiple get calls with different params (eg. autocompletion)
  private loadingHash: string = "";

  constructor(config: C) {
    super(config);
    this.initialConfig = config;

    if (config.autopersistConfigKey) {
      this.autopersistConfigKey = config.autopersistConfigKey;
      const storage = sessionStorage || localStorage;
      const storedConfig =
        storage && storage.getItem(this.autopersistConfigKey);
      if (storedConfig) {
        const c = JSON.parse(storedConfig);

        this.search = c.search;
        this.sorting = c.sorting;
        this.offset = c.offset;
        this.limit = c.limit;

        this.filters = c.filters;

        return;
      }
    }

    this.setInitialValues(config);
  }

  private autopersistConfig = () => {
    if (this.autopersistConfigKey) {
      const config = {
        filters: this.filters,
        search: this.search,
        sorting: this.sorting,
        offset: this.offset,
        limit: this.limit,
      };
      const storage = sessionStorage || localStorage;
      if (storage)
        storage.setItem(this.autopersistConfigKey, JSON.stringify(config));
    }
  };

  public get = async (): Promise<void> => {
    this.error = undefined;
    this.loading = true;
    const currentHash = Math.random().toString(36).substring(2);
    this.loadingHash = currentHash;
    this.triggerOnChangeIfNeeded();
    try {
      let res = await this.dataSource.list(
        this.name,
        this.fields,
        this.initialConfig.aggregations,
        this.filters,
        this.search,
        this.sorting,
        this.offset,
        this.limit,
        this.arguments
      );
      if (res && this.loadingHash == currentHash) {
        this.count = res.count;
        this.aggregations = res.aggregations;
        this.setData(res.items || []);
        this.initialized = true;
      }
    } catch (err) {
      if (this.loadingHash == currentHash) {
        this.error = err;
      }
    } finally {
      if (this.loadingHash == currentHash) {
        this.loading = false;
      }
      this.triggerOnChangeIfNeeded();
    }
  };

  public reload = async () => {
    this.resetPolling();
    return this.get();
  };

  delete = async (id: string | number) => {
    let res = await this.dataSource.delete(this.name, id, ["id"]);
    return res;
  };

  getItem = (props: {
    id: string | number;
    args?: { [key: string]: any };
    autoload?: boolean;
  }): Resource => {
    let item = new Resource({
      name: this.name,
      id: props.id,
      initialArgs: props.args,
      dataSource: this.dataSource,
      fields: this.fields,
    });

    return item;
  };

  // item has to be loaded in current dataset
  public async patchItemValues(
    id: ResourceID,
    values: Partial<T>
  ): Promise<Resource> {
    const itemData = this.data?.find((x) => x.id == id);

    if (typeof itemData === "undefined") {
      throw new Error(
        `item with id ${id} not found in current collection dataset`
      );
    }

    const res = this.getItem({ id });
    res.setData(itemData);
    await res.patch(values);

    const newData = this.data?.map((x) =>
      x.id == id && res.data ? res.data : x
    );
    if (newData) {
      this.setData(newData as T[]);
    }

    return res;
  }

  setInitialValues = (values: ResourceCollectionConfig<T>) => {
    this.search = values.initialSearch;
    this.sorting = values.initialSorting;
    this.offset = values.initialOffset;
    this.limit = values.initialLimit;

    this.updateFilters(values.initialFilters, false, false);
    this.triggerOnChangeIfNeeded();
  };

  resetFilters = () => {
    this.setInitialValues(this.initialConfig);
    this.triggerOnChangeIfNeeded();
  };

  resetPagination = () => {
    this.offset = 0;
    this.triggerOnChangeIfNeeded();
  };

  updateFilters = async (
    filters?: DataSourceArgumentMap,
    autoreload: boolean = true,
    autopersist: boolean = true
  ): Promise<void> => {
    return this.updateNamedFilters(
      "_default",
      filters,
      autoreload,
      autopersist
    );
  };

  updateNamedFilters = async (
    key: string,
    filters?: DataSourceArgumentMap,
    autoreload: boolean = true,
    autopersist: boolean = true
  ) => {
    const filtersBefore = JSON.stringify(this.filters);
    this.filters = this.filters || {};
    if (filters) {
      this.filters[key] = filters;
    } else {
      delete this.filters[key];
    }
    const filtersAfter = JSON.stringify(this.filters);
    const filtersChanged = filtersBefore !== filtersAfter;

    this.hasFilterChanges = this.hasFilterChanges || filtersChanged;

    if (filtersChanged) this.resetPagination();
    if (autopersist) this.autopersistConfig();
    this.triggerOnChangeIfNeeded();
    if (autoreload) return this.reload();
  };

  namedFilter = (key: string): DataSourceArgumentMap | undefined => {
    return this.filters && this.filters[key];
  };

  updateSearch = async (
    search?: string,
    autoreload: boolean = true
  ): Promise<void> => {
    this.search = search;
    this.resetPagination();
    this.autopersistConfig();
    this.triggerOnChangeIfNeeded();
    if (autoreload) return this.reload();
  };

  updateSorting = async (
    sorting?: SortInfo[],
    autoreload: boolean = true
  ): Promise<void> => {
    this.sorting = sorting;
    this.autopersistConfig();
    this.triggerOnChangeIfNeeded();
    if (autoreload) return this.reload();
  };

  updateOffset = async (
    offset?: number,
    autoreload: boolean = true
  ): Promise<void> => {
    this.offset = offset;
    this.autopersistConfig();
    this.triggerOnChangeIfNeeded();
    if (autoreload) return this.reload();
  };

  updateLimit = async (
    limit?: number,
    autoreload: boolean = true
  ): Promise<void> => {
    this.limit = limit;
    this.autopersistConfig();
    this.triggerOnChangeIfNeeded();
    if (autoreload) return this.reload();
  };

  public get page(): number {
    const limit = this.limit || 30;
    const offset = this.offset || 0;
    return Math.ceil(offset / limit);
  }
}
