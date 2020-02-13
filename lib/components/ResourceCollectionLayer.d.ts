import * as React from "react";
import { ResourceCollection, ResourceCollectionConfig } from "../ResourceCollection";
import { DataSourceArgumentMap } from "../DataSource";
import { SortInfo } from "../DataSourceRequest";
import { ResourceID } from "../Resource";
export interface ResourceCollectionLayerProps<T extends {
    id: ResourceID;
} = any> extends ResourceCollectionConfig<T> {
    autoload?: boolean;
    render: (resource: ResourceCollection<T>) => React.ReactNode;
    values?: {
        filters?: DataSourceArgumentMap;
        search?: string;
        sorting?: SortInfo[];
        offset?: number;
        limit?: number;
    };
}
export interface ResourceCollectionLayerState {
    resource?: ResourceCollection<any>;
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
