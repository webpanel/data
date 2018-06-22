import { observable } from 'mobx';
import { ResourceBase } from './ResourceBase';

export class ResourceCollection extends ResourceBase<any[] | null> {
  @observable count: number | undefined = undefined;

  get = async () => {
    this.loading = true;
    let res = await this.dataSource.list(
      this.name,
      this.fields
      // this.args || {}
    );
    this.data = res.items || [];
    this.count = res.count;
    this.loading = false;
  };
}
