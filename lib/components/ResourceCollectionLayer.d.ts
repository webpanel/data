import * as React from 'react';
import { ResourceCollection, ResourceCollectionConfig } from '../ResourceCollection';
export interface ResourceCollectionLayerProps extends ResourceCollectionConfig {
    autoload?: boolean;
    render: (resource: ResourceCollection) => React.ReactNode;
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
    componentWillMount(): void;
    render(): {} | null | undefined;
}
