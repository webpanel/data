import { observable, toJS } from 'mobx';

import { DataSource } from './DataSource';

export interface ResourceBaseConfig {
  dataSource: DataSource;
  name: string;
  fields?: string[];
  initialArgs?: { [key: string]: any };
  // automatically refresh data (calls get internally)
  pollInterval?: number;
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
  @observable
  error: Error | undefined = undefined;

  private pollRefreshInterval?: NodeJS.Timer;

  constructor(config: ResourceBaseConfig) {
    this.dataSource = config.dataSource;
    this.name = config.name;
    this.fields = config.fields;
    this.arguments = config.initialArgs;

    if (config.pollInterval) {
      this.startPolling(config.pollInterval);
    }
  }

  public startPolling(interval: number) {
    if (typeof this.pollRefreshInterval === 'undefined') {
      this.pollRefreshInterval = setInterval(() => this.get(), interval);
    }
  }

  public stopPolling() {
    if (typeof this.pollRefreshInterval !== 'undefined') {
      clearInterval(this.pollRefreshInterval);
    }
  }

  public async get() {
    throw new Error('get method not implemented');
  }

  getRawData(): T | undefined {
    const data = toJS(this.data);
    return data;
  }
}
