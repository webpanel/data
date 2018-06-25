/// <reference types="react" />
import * as React from 'react';
import { Resource, ResourceConfig } from '../Resource';
export interface ResourceLayerConfig extends ResourceConfig {
    render: (resource: Resource) => React.ReactNode;
}
export declare class ResourceLayer extends React.Component<ResourceLayerConfig> {
    state: {
        errors: never[];
        resource: undefined;
    };
    handleError: (err: Error) => void;
    createResource(): void;
    componentWillMount(): void;
    render(): {} | null | undefined;
}
