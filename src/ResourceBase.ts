import { DataSource } from "./DataSource";

export interface ResourceBaseOptions<T> {
  dataTransform?: (items: T) => T;
  onDidChange?: () => void; // called when resource state changes (attributes, data, ...)
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
  public onPollHandler?: () => void;

  initialized: boolean = false;
  loading: boolean = false;
  polling: boolean = false;
  data: T | undefined = undefined;
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

  protected async tryWithLoading(
    p: Promise<any>,
    saveError = true
  ): Promise<any> {
    this.error = undefined;
    this.loading = true;
    this.triggerOnChangeIfNeeded();
    try {
      return await p;
    } catch (err) {
      if (saveError) {
        this.error = err;
      } else {
        this.loading = false;
        throw err;
      }
    } finally {
      this.loading = false;
      this.triggerOnChangeIfNeeded();
    }
  }

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
      this.pollRefreshInterval = undefined;
    }
  };

  public get = async (): Promise<void> => {
    throw new Error("get method not implemented");
  };

  setData = (data: T | undefined) => {
    if (this.config.dataTransform && typeof data !== "undefined") {
      this.data = this.config.dataTransform(data);
    } else {
      this.data = data;
    }
    this.triggerOnChangeIfNeeded();
  };

  protected triggerOnChangeIfNeeded() {
    if (this.config.onDidChange) {
      this.config.onDidChange();
    }
  }

  getData = (): T | undefined => {
    return this.data;
  };
}
