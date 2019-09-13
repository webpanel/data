import * as React from 'react';
import { Resource, ResourceConfig } from '../Resource';
export interface ResourceLayerProps<T> extends ResourceConfig<T> {
    autoload?: boolean;
    render: (resource: Resource) => React.ReactNode;
}
export interface ResourceLayerState {
    errors: Error[];
    resource?: Resource;
}
export declare class ResourceLayer<T = {
    [key: string]: any;
}> extends React.Component<ResourceLayerProps<T>, ResourceLayerState> {
    state: ResourceLayerState;
    handleError: (err: Error) => never;
    createResource(): void;
    componentWillMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    render(): React.ReactNode;
}
