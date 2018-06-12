/// <reference types="react" />
import * as React from 'react';
import { Resource, ResourceConfig } from '../Resource';
export interface ResourceLayerConfig {
    render: (data: Resource) => React.ReactNode;
    config: ResourceConfig;
}
export interface ResourceLayerState {
    errors: Error[];
    resource?: Resource;
}
export declare class ResourceLayer extends React.Component<ResourceLayerConfig, ResourceLayerState> {
    state: {
        errors: never[];
        resource: undefined;
    };
    handleError: (err: Error) => void;
    createResource(): void;
    componentWillMount(): void;
    render(): {} | null | undefined;
}
