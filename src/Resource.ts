import { ResourceBase, ResourceBaseConfig } from './ResourceBase';

export interface ResourceConfig extends ResourceBaseConfig {
  id?: string | number;
  defaultValues?: { [key: string]: any };
}

export class Resource extends ResourceBase<any | null> {
  id?: string | number;

  constructor(config: ResourceConfig) {
    super(config);
    this.id = config.id;
    if (!this.id) {
      this.data = config.defaultValues;
    }
  }

  getIfHasID = async () => {
    if (this.id) {
      return this.get();
    }
  };

  get = async () => {
    if (!this.id) {
      throw new Error('resource id is missing');
    }
    this.loading = true;
    let res = await this.dataSource.read(this.name, this.id, this.fields);
    this.data = res;
    this.loading = false;
    return res;
  };

  create = async (values: { [key: string]: any }) => {
    this.loading = true;
    let res = await this.dataSource.create(this.name, values, [
      'id',
      ...this.fields
    ]);
    this.data = res;
    this.id = res.id;
    this.loading = false;
    return res;
  };

  update = async (values: { [key: string]: any }) => {
    if (!this.id) {
      throw new Error('resource id is missing');
    }
    this.loading = true;
    let res = await this.dataSource.update(
      this.name,
      this.id,
      values,
      this.fields
    );
    this.data = res;
    this.loading = false;
    return res;
  };

  delete = async () => {
    if (!this.id) {
      throw new Error('resource id is missing');
    }
    this.loading = true;
    let res = await this.dataSource.delete(this.name, this.id, this.fields);
    this.data = res;
    this.loading = false;
    return res;
  };

  isPersisted = (): boolean => {
    return !!this.id;
  };

  save = async (values: { [key: string]: any }) => {
    if (!this.id) {
      return this.create(values);
    }
    return this.update(values);
  };
}
