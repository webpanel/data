import { ResourceBase, ResourceBaseConfig } from './ResourceBase';

import { DataSourceArgumentMap } from './DataSource';
import { Resource } from './Resource';
import { SortInfo } from './DataSourceRequest';
import { observable } from 'mobx';

export interface ResourceCollectionConfig extends ResourceBaseConfig {
  autopersistConfigKey?: string;

  initialFilters?: DataSourceArgumentMap;
  initialSearch?: string;
  initialSorting?: SortInfo[];
  initialOffset?: number;
  initialLimit?: number;
}

export class ResourceCollection extends ResourceBase<any[] | null> {
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

  autopersistConfigKey?: string;

  constructor(config: ResourceCollectionConfig) {
    super(config);

    if (config.autopersistConfigKey) {
      this.autopersistConfigKey = config.autopersistConfigKey;
      const storedConfig = localStorage.getItem(this.autopersistConfigKey);
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

    this.search = config.initialSearch;
    this.sorting = config.initialSorting;
    this.offset = config.initialOffset;
    this.limit = config.initialLimit;

    this.updateFilters(config.initialFilters, false, false);
  }

  private autopersistConfig() {
    if (this.autopersistConfigKey) {
      const config = {
        filters: this.filters,
        search: this.search,
        sorting: this.sorting,
        offset: this.offset,
        limit: this.limit
      };
      localStorage.setItem(this.autopersistConfigKey, JSON.stringify(config));
    }
  }

  get = async () => {
    this.error = undefined;
    this.loading = true;
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
      if (res) {
        this.data = res.items || [];
        this.count = res.count;
      }
    } catch (err) {
      this.error = err;
    } finally {
      this.loading = false;
    }
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

  async updateFilters(
    filters?: DataSourceArgumentMap,
    autoreload: boolean = true,
    autopersist: boolean = true
  ): Promise<void> {
    return this.updateNamedFilters(
      '_default',
      filters,
      autoreload,
      autopersist
    );
  }

  async updateNamedFilters(
    key: string,
    filters?: DataSourceArgumentMap,
    autoreload: boolean = true,
    autopersist: boolean = true
  ) {
    this.filters = this.filters || {};
    if (filters) {
      this.filters[key] = filters;
    } else {
      delete this.filters[key];
    }
    if (autopersist) this.autopersistConfig();
    if (autoreload) return this.get();
  }

  namedFilter(key: string): DataSourceArgumentMap | undefined {
    return this.filters && this.filters[key];
  }

  async updateSearch(
    search?: string,
    autoreload: boolean = true
  ): Promise<void> {
    this.search = search;
    this.autopersistConfig();
    if (autoreload) return this.get();
  }

  async updateSorting(
    sorting?: SortInfo[],
    autoreload: boolean = true
  ): Promise<void> {
    this.sorting = sorting;
    this.autopersistConfig();
    if (autoreload) return this.get();
  }

  async updateOffset(
    offset?: number,
    autoreload: boolean = true
  ): Promise<void> {
    this.offset = offset;
    this.autopersistConfig();
    if (autoreload) return this.get();
  }

  async updateLimit(limit?: number, autoreload: boolean = true): Promise<void> {
    this.limit = limit;
    this.autopersistConfig();
    if (autoreload) return this.get();
  }

  public get page(): number {
    const limit = this.limit || 30;
    const offset = this.offset || 0;
    return Math.ceil(offset / limit);
  }
}
