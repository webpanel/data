import { observable } from 'mobx';
import { DataSource } from './DataSource';

export interface ResourceConfig {
  id?: string | number;
  dataSource: DataSource;
  name: string;
  fields: string[];
  args?: { [key: string]: any };
  defaultValues?: { [key: string]: any };
}

export class Resource {
  id?: string | number;
  name: string;
  dataSource: DataSource;
  fields: string[];
  args?: { [key: string]: any };

  @observable loading: boolean = false;
  @observable data: any | null = null;

  constructor(config: ResourceConfig) {
    this.id = config.id;
    this.dataSource = config.dataSource;
    // this.dataSource = DataSourceProvider.shared().getDataSource(
    //   config.dataSource
    // );
    this.name = config.name;
    this.fields = config.fields;

    if (!this.id) {
      this.data = config.defaultValues;
    }
  }

  getIfHasID = async () => {
    // console.log('get???', this.id);
    if (this.id) {
      return this.get();
    }
  };

  get = async () => {
    if (!this.id) {
      throw new Error('resource id is missing');
    }
    this.loading = true;
    let res = await this.dataSource.read(
      this.name,
      this.id,
      this.fields,
      this.args || {}
    );
    this.data = res;
    this.loading = false;
  };
  create = async (values: { [key: string]: any }) => {
    this.loading = true;
    let res = await this.dataSource.create(this.name, values, [
      'id',
      ...this.fields
    ]);
    // console.log('created???', res);
    this.data = res;
    this.id = res.id;
    this.loading = false;
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
  };
  delete = async () => {
    if (!this.id) {
      throw new Error('resource id is missing');
    }
    this.loading = true;
    let res = await this.dataSource.delete(this.name, this.id, this.fields);
    this.data = res;
    this.loading = false;
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
