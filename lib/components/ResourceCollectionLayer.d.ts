/// <reference types="react" />
import * as React from 'react';
import { ResourceCollection, ResourceCollectionConfig } from '../ResourceCollection';
export interface ResourceCollectionLayerConfig extends ResourceCollectionConfig {
    render: (resource: ResourceCollection) => React.ReactNode;
}
export declare class ResourceCollectionLayer extends React.Component<ResourceCollectionLayerConfig> {
    state: {
        errors: never[];
        resource: undefined;
    };
    handleError: (err: Error) => void;
    createResource(): void;
    componentWillMount(): void;
    render(): {} | null | undefined;
}
