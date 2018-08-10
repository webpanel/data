import { observable } from 'mobx';
import { ResourceBase, ResourceBaseConfig } from './ResourceBase';
import { DataSourceArgumentMap } from './DataSource';
import { SortInfo } from './DataSourceRequest';
import { Resource } from './Resource';

export interface ResourceCollectionConfig extends ResourceBaseConfig {
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

  constructor(config: ResourceCollectionConfig) {
    super(config);
    this.search = config.initialSearch;
    this.sorting = config.initialSorting;
    this.offset = config.initialOffset;
    this.limit = config.initialLimit;

    this.updateFilters(config.initialFilters, false);
  }

  get = async () => {
    this.loading = true;
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
    this.loading = false;
  };

  delete = async (id: string | number) => {
    let res = await this.dataSource.delete(this.name, id, this.fields);
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
      initialFields: this.fields
    });

    return item;
  };

  async updateFilters(
    filters?: DataSourceArgumentMap,
    autoreload: boolean = true
  ): Promise<void> {
    return this.updateNamedFilters('_default', filters, autoreload);
  }

  async updateNamedFilters(
    key: string,
    filters?: DataSourceArgumentMap,
    autoreload: boolean = true
  ) {
    this.filters = this.filters || {};
    if (filters) {
      this.filters[key] = filters;
    } else {
      delete this.filters[key];
    }
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
    if (autoreload) return this.get();
  }

  async updateSorting(
    sorting?: SortInfo[],
    autoreload: boolean = true
  ): Promise<void> {
    this.sorting = sorting;
    if (autoreload) return this.get();
  }

  async updateOffset(
    offset?: number,
    autoreload: boolean = true
  ): Promise<void> {
    this.offset = offset;
    if (autoreload) return this.get();
  }

  async updateLimit(limit?: number, autoreload: boolean = true): Promise<void> {
    this.limit = limit;
    if (autoreload) return this.get();
  }
}
