import { DataSource } from './DataSource';
export interface ResourceBaseOptions<T> {
    dataTransform?: (items: T) => T;
    pollInterval?: number;
}
export interface ResourceBaseConfig {
    dataSource: DataSource;
    name: string;
    fields?: string[];
    initialArgs?: {
        [key: string]: any;
    };
}
export declare class ResourceBase<T> {
    private config;
    name: string;
    dataSource: DataSource;
    fields?: string[];
    arguments?: {
        [key: string]: any;
    };
    pollInterval?: number;
    initialized: boolean;
    loading: boolean;
    polling: boolean;
    data: T | undefined;
    error: Error | undefined;
    private pollRefreshInterval?;
    constructor(config: ResourceBaseConfig & ResourceBaseOptions<T>);
    resetPolling: () => void;
    startPolling: () => void;
    stopPolling: () => void;
    get: () => Promise<void>;
    setRawData: (data: T | undefined) => void;
    getRawData: () => T | undefined;
}
