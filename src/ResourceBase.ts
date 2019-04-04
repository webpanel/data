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
  pollInterval?: number;

  @observable
  loading: boolean = false;
  @observable
  polling: boolean = false;
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
    this.pollInterval = config.pollInterval;
  }

  public resetPolling() {
    this.stopPolling();
    this.startPolling();
  }

  public startPolling() {
    if (
      typeof this.pollInterval !== 'undefined' &&
      typeof this.pollRefreshInterval === 'undefined'
    ) {
      this.pollRefreshInterval = setInterval(async () => {
        this.polling = true;
        await this.get();
        this.polling = false;
      }, this.pollInterval);
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
