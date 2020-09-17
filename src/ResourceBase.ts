import { observable, toJS } from "mobx";

import { DataSource } from "./DataSource";

export interface ResourceBaseOptions<T> {
  dataTransform?: (items: T) => T;
  pollInterval?: number;
}

export interface ResourceBaseConfig {
  dataSource: DataSource;
  name: string;
  fields?: string[];
  initialArgs?: { [key: string]: any };
  // automatically refresh data (calls get internally)
}

export class ResourceBase<T> {
  name: string;
  dataSource: DataSource;
  fields?: string[];
  arguments?: { [key: string]: any };
  pollInterval?: number;
  public onPollHandler?: () => {};

  @observable
  initialized: boolean = false;
  @observable
  loading: boolean = false;
  @observable
  polling: boolean = false;
  @observable
  data: T | undefined = undefined;
  @observable
  error: Error | undefined = undefined;

  private pollRefreshInterval?: NodeJS.Timer;

  constructor(private config: ResourceBaseConfig & ResourceBaseOptions<T>) {
    this.dataSource = config.dataSource;
    this.name = config.name;
    this.fields = config.fields;
    this.arguments = config.initialArgs;
    this.pollInterval = config.pollInterval;
  }

  public resetPolling = () => {
    this.stopPolling();
    this.startPolling();
  };

  private runPoll = async () => {
    if (!this.loading && !this.polling) {
      this.polling = true;
      await this.get();
      this.polling = false;
      if (this.onPollHandler) {
        this.onPollHandler();
      }
    }
  };

  public startPolling = () => {
    if (
      typeof this.pollInterval !== "undefined" &&
      typeof this.pollRefreshInterval === "undefined"
    ) {
      this.pollRefreshInterval = setInterval(() => {
        this.runPoll();
      }, this.pollInterval);
    }
  };

  public stopPolling = () => {
    if (typeof this.pollRefreshInterval !== "undefined") {
      clearInterval(this.pollRefreshInterval);
    }
  };

  public get = async (): Promise<void> => {
    throw new Error("get method not implemented");
  };

  setRawData = (data: T | undefined) => {
    if (this.config.dataTransform && typeof data !== "undefined") {
      this.data = this.config.dataTransform(data);
    } else {
      this.data = data;
    }
  };

  getRawData = (): T | undefined => {
    const data = toJS(this.data);
    return data;
  };
}
