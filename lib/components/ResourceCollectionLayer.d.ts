import * as React from 'react';
import { ResourceCollection, ResourceCollectionConfig } from '../ResourceCollection';
import { DataSourceArgumentMap } from '../DataSource';
import { SortInfo } from '../DataSourceRequest';
export interface ResourceCollectionLayerProps extends ResourceCollectionConfig {
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
    errors: Error[];
    resource?: ResourceCollection;
}
export declare class ResourceCollectionLayer extends React.Component<ResourceCollectionLayerProps, ResourceCollectionLayerState> {
    state: {
        errors: never[];
        resource: undefined;
    };
    handleError: (err: Error) => never;
    createResource(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Readonly<ResourceCollectionLayerProps>): void;
    render(): {} | null | undefined;
}
