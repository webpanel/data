import * as React from 'react';
import { ResourceCollection, ResourceCollectionConfig } from '../ResourceCollection';
import { DataSourceArgumentMap } from '../DataSource';
import { SortInfo } from '../DataSourceRequest';
export interface ResourceCollectionLayerProps<T = any> extends ResourceCollectionConfig<T> {
    autoload?: boolean;
    render: (resource: ResourceCollection) => React.ReactNode;
    values?: {
        filters?: DataSourceArgumentMap;
        search?: string;
        sorting?: SortInfo[];
        offset?: number;
        limit?: number;
    };
}
export interface ResourceCollectionLayerState {
    resource?: ResourceCollection;
}
export declare class ResourceCollectionLayer extends React.Component<ResourceCollectionLayerProps, ResourceCollectionLayerState> {
    state: ResourceCollectionLayerState;
    handleError: (error: Error) => never;
    createResource(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    reload(): void;
    render(): React.ReactNode;
}
