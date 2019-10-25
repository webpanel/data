import { ResourceBase, ResourceBaseConfig } from './ResourceBase';

import { DataSourceArgumentMap } from './DataSource';
import { Resource } from './Resource';
import { SortInfo } from './DataSourceRequest';
import { observable } from 'mobx';

export interface ResourceCollectionOptions<T> {
  autopersistConfigKey?: string;

  initialFilters?: DataSourceArgumentMap;
  initialSearch?: string;
  initialSorting?: SortInfo[];
  initialOffset?: number;
  initialLimit?: number;

  dataTransform?: (items: T[]) => T[];
}

export type ResourceCollectionConfig<T> = ResourceBaseConfig &
  ResourceCollectionOptions<T>;

export class ResourceCollection<
  T = any,
  C extends ResourceCollectionConfig<T> = ResourceCollectionConfig<T>
> extends ResourceBase<T[]> {
  @observable
  count: number | undefined = undefined;
  @observable
  filters?: { [key: string]: DataSourceArgumentMap };
  @observable
  search?: string;
  @observable
  sorting?: any;
  @observable
  offset?: number;
  @observable
  limit?: number;

  initialConfig: C;
  autopersistConfigKey?: string;

  @observable
  hasFilterChanges: boolean = false;

  // this hash is used to simulate "cancelling" behaviour of loading requests
  // it's compared with the latest generated requst hash to make sure that resource collection displays only latest loading request
  // this is required in case of multiple get calls with different params (eg. autocompletion)
  private loadingHash: string = '';

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
        limit: this.limit
      };
      const storage = sessionStorage || localStorage;
      if (storage)
        storage.setItem(this.autopersistConfigKey, JSON.stringify(config));
    }
  };

  public get = async (): Promise<void> => {
    this.error = undefined;
    this.loading = true;
    const currentHash = Math.random()
      .toString(36)
      .substring(2);
    this.loadingHash = currentHash;
    try {
      let res = await this.dataSource.list(
        this.name,
        this.fields,
        this.filters,
        this.search,
        this.sorting,
        this.offset,
        this.limit,
        this.arguments
      );
      if (res && this.loadingHash == currentHash) {
        this.data = res.items || [];
        this.count = res.count;
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
    }
  };

  public reload = async () => {
    this.resetPolling();
    return this.get();
  };

  delete = async (id: string | number) => {
    let res = await this.dataSource.delete(this.name, id, ['id']);
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
      fields: this.fields
    });

    return item;
  };

  setInitialValues = (values: ResourceCollectionConfig<T>) => {
    this.search = values.initialSearch;
    this.sorting = values.initialSorting;
    this.offset = values.initialOffset;
    this.limit = values.initialLimit;

    this.updateFilters(values.initialFilters, false, false);
  };

  resetFilters = () => {
    this.setInitialValues(this.initialConfig);
  };

  resetPagination = () => {
    this.offset = 0;
  };

  updateFilters = async (
    filters?: DataSourceArgumentMap,
    autoreload: boolean = true,
    autopersist: boolean = true
  ): Promise<void> => {
    return this.updateNamedFilters(
      '_default',
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
    if (autoreload) return this.reload();
  };

  updateSorting = async (
    sorting?: SortInfo[],
    autoreload: boolean = true
  ): Promise<void> => {
    this.sorting = sorting;
    this.autopersistConfig();
    if (autoreload) return this.reload();
  };

  updateOffset = async (
    offset?: number,
    autoreload: boolean = true
  ): Promise<void> => {
    this.offset = offset;
    this.autopersistConfig();
    if (autoreload) return this.reload();
  };

  updateLimit = async (
    limit?: number,
    autoreload: boolean = true
  ): Promise<void> => {
    this.limit = limit;
    this.autopersistConfig();
    if (autoreload) return this.reload();
  };

  public get page(): number {
    const limit = this.limit || 30;
    const offset = this.offset || 0;
    return Math.ceil(offset / limit);
  }
}
