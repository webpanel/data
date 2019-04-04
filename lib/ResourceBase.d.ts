import { DataSource } from './DataSource';
export interface ResourceBaseConfig {
    dataSource: DataSource;
    name: string;
    fields?: string[];
    initialArgs?: {
        [key: string]: any;
    };
    pollInterval?: number;
}
export declare class ResourceBase<T> {
    name: string;
    dataSource: DataSource;
    fields?: string[];
    arguments?: {
        [key: string]: any;
    };
    loading: boolean;
    polling: boolean;
    data: T | undefined;
    error: Error | undefined;
    private pollRefreshInterval?;
    constructor(config: ResourceBaseConfig);
    startPolling(interval: number): void;
    stopPolling(): void;
    get(): Promise<void>;
    getRawData(): T | undefined;
}
