import { observable } from 'mobx';
import { ResourceBase, ResourceBaseConfig } from './ResourceBase';
import { DataSourceArgumentMap } from './DataSource';
import { SortInfo } from './DataSourceRequest';

export interface ResourceCollectionConfig extends ResourceBaseConfig {
  filters?: DataSourceArgumentMap;
  search?: string;
  sorting?: SortInfo[];
  offset?: number;
  limit?: number;
}

export class ResourceCollection extends ResourceBase<any[] | null> {
  @observable count: number | undefined = undefined;
  @observable filters?: DataSourceArgumentMap;
  @observable search?: string;
  @observable sorting?: any;
  @observable offset?: number;
  @observable limit?: number;

  constructor(config: ResourceCollectionConfig) {
    super(config);
    this.filters = config.filters;
    this.search = config.search;
    this.sorting = config.sorting;
    this.offset = config.offset;
    this.limit = config.limit;
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
    let res = await this.dataSource.delete(this.name, id, []);
    return res;
  };

  updateFilters(filters: DataSourceArgumentMap): Promise<void> {
    this.filters = filters;
    return this.get();
  }

  updateSearch(search?: string): Promise<void> {
    this.search = search;
    return this.get();
  }

  updateSorting(sorting: SortInfo[]): Promise<void> {
    this.sorting = sorting;
    return this.get();
  }

  updateOffset(offset: number): Promise<void> {
    this.offset = offset;
    return this.get();
  }

  updateLimit(limit: number): Promise<void> {
    this.limit = limit;
    return this.get();
  }
}
