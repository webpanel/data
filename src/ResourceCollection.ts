import { observable } from 'mobx';
import { ResourceBase, ResourceBaseConfig } from './ResourceBase';
import { DataSourceArgumentMap } from './DataSource';

export interface ResourceCollectionConfig extends ResourceBaseConfig {
  filters?: DataSourceArgumentMap;
  sorting?: string[];
  offset?: number;
  limit?: number;
}

export class ResourceCollection extends ResourceBase<any[] | null> {
  @observable count: number | undefined = undefined;
  @observable filters?: any;
  @observable sorting?: any;
  @observable offset?: number;
  @observable limit?: number;

  constructor(config: ResourceCollectionConfig) {
    super(config);
    this.filters = config.filters;
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
}
