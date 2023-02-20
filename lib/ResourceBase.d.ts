import { DataSource } from "./DataSource";
export interface ResourceBaseOptions<T, R> {
    dataTransform?: (items: T, resource: R) => T;
    onDidChange?: () => void;
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
    onPollHandler?: () => void;
    initialized: boolean;
    loading: boolean;
    polling: boolean;
    data: T | undefined;
    error: Error | undefined;
    private pollRefreshInterval?;
    constructor(config: ResourceBaseConfig & ResourceBaseOptions<T, ResourceBase<T>>);
    resetPolling: () => void;
    private runPoll;
    protected tryWithLoading(p: Promise<any>, saveError?: boolean): Promise<any>;
    startPolling: () => void;
    stopPolling: () => void;
    get: () => Promise<void>;
    setData: (data: T | undefined) => void;
    protected triggerOnChangeIfNeeded(): void;
    getData: () => T | undefined;
}
