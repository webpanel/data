import { observable, toJS } from 'mobx';
import { DataSource } from './DataSource';

export interface ResourceBaseConfig {
  dataSource: DataSource;
  name: string;
  fields?: string[];
  initialArgs?: { [key: string]: any };
}

export class ResourceBase<T> {
  name: string;
  dataSource: DataSource;
  fields?: string[];
  arguments?: { [key: string]: any };

  @observable
  loading: boolean = false;
  @observable
  data: T | undefined = undefined;

  constructor(config: ResourceBaseConfig) {
    this.dataSource = config.dataSource;
    this.name = config.name;
    this.fields = config.fields || ['id'];
    this.arguments = config.initialArgs;
  }

  getRawData(): T | undefined {
    const data = toJS(this.data);
    return data;
  }
}
