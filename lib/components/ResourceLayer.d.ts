import * as React from 'react';
import { Resource, ResourceConfig } from '../Resource';
export interface ResourceLayerProps extends ResourceConfig {
    autoload?: boolean;
    render: (resource: Resource) => React.ReactNode;
}
export interface ResourceLayerState {
    errors: Error[];
    resource?: Resource;
}
export declare class ResourceLayer extends React.Component<ResourceLayerProps, ResourceLayerState> {
    state: {
        errors: never[];
        resource: undefined;
    };
    handleError: (err: Error) => void;
    createResource(): void;
    componentWillMount(): void;
    render(): {} | null | undefined;
}
