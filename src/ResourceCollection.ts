import { observable } from 'mobx';
import { ResourceBase, ResourceBaseConfig } from './ResourceBase';

export interface ResourceCollectionConfig extends ResourceBaseConfig {
  filter?: any;
  sorting?: any;
  page?: number;
}

export class ResourceCollection extends ResourceBase<any[] | null> {
  @observable count: number | undefined = undefined;

  constructor(config: ResourceCollectionConfig) {
    super(config);
  }

  get = async () => {
    this.loading = true;
    let res = await this.dataSource.list(
      this.name,
      this.fields
      // this.args || {}
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
