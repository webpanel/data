/// <reference types="react" />
import * as React from 'react';
import { ResourceCollection, ResourceCollectionConfig } from '../ResourceCollection';
export interface ResourceCollectionLayerConfig extends ResourceCollectionConfig {
    render: (resource: ResourceCollection) => React.ReactNode;
}
export interface ResourceCollectionLayerState {
    errors: Error[];
    resource?: ResourceCollection;
}
export declare class ResourceCollectionLayer extends React.Component<ResourceCollectionLayerConfig, ResourceCollectionLayerState> {
    state: {
        errors: never[];
        resource: undefined;
    };
    handleError: (err: Error) => void;
    createResource(): void;
    componentWillMount(): void;
    render(): {} | null | undefined;
}
