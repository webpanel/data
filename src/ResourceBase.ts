import { observable } from 'mobx';
import { DataSource } from './DataSource';

export interface ResourceBaseConfig {
  dataSource: DataSource;
  name: string;
  fields: string[];
  args?: { [key: string]: any };
}

export class ResourceBase<T> {
  name: string;
  dataSource: DataSource;
  fields: string[];
  args?: { [key: string]: any };

  @observable loading: boolean = false;
  @observable data: T | undefined = undefined;

  constructor(config: ResourceBaseConfig) {
    this.dataSource = config.dataSource;
    // this.dataSource = DataSourceProvider.shared().getDataSource(
    //   config.dataSource
    // );
    this.name = config.name;
    this.fields = config.fields;
  }

  // get = async () => {
  //   this.loading = true;
  //   let res = await this.dataSource.read(
  //     this.name,
  //     this.id,
  //     this.fields,
  //     this.args || {}
  //   );
  //   this.data = res;
  //   this.loading = false;
  // };
  // create = async (values: { [key: string]: any }) => {
  //   this.loading = true;
  //   let res = await this.dataSource.create(this.name, values, [
  //     'id',
  //     ...this.fields
  //   ]);
  //   // console.log('created???', res);
  //   this.data = res;
  //   this.id = res.id;
  //   this.loading = false;
  // };
  // update = async (values: { [key: string]: any }) => {
  //   if (!this.id) {
  //     throw new Error('resource id is missing');
  //   }
  //   this.loading = true;
  //   let res = await this.dataSource.update(
  //     this.name,
  //     this.id,
  //     values,
  //     this.fields
  //   );
  //   this.data = res;
  //   this.loading = false;
  // };
  // delete = async () => {
  //   if (!this.id) {
  //     throw new Error('resource id is missing');
  //   }
  //   this.loading = true;
  //   let res = await this.dataSource.delete(this.name, this.id, this.fields);
  //   this.data = res;
  //   this.loading = false;
  // };

  // isPersisted = (): boolean => {
  //   return !!this.id;
  // };

  // save = async (values: { [key: string]: any }) => {
  //   if (!this.id) {
  //     return this.create(values);
  //   }
  //   return this.update(values);
  // };
}
