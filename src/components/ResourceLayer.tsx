import * as React from 'react';

import { Resource, ResourceConfig } from '../Resource';

import { observer } from 'mobx-react';

export interface ResourceLayerProps<T> extends ResourceConfig<T> {
  autoload?: boolean;
  render: (resource: Resource) => React.ReactNode;
}

export interface ResourceLayerState {
  errors: Error[];
  resource?: Resource;
}

@observer
export class ResourceLayer<T = { [key: string]: any }> extends React.Component<
  ResourceLayerProps<T>,
  ResourceLayerState
> {
  state: ResourceLayerState = { errors: [], resource: undefined };

  handleError = (err: Error) => {
    throw err;
  };

  createResource() {
    const { render, ...props } = this.props;

    const resource = new Resource(props);

    if (this.props.autoload || typeof this.props.autoload === 'undefined') {
      resource.getIfHasID().catch(this.handleError);
    }

    this.setState({ resource });
    resource.startPolling();
  }

  componentWillMount() {
    this.createResource();

    if (this.state.resource) {
      this.state.resource.startPolling();
    }
  }

  componentWillUnmount() {
    if (this.state.resource) {
      this.state.resource.stopPolling();
    }
  }

  componentDidUpdate() {
    const { id, fields } = this.props;

    const resource = this.state.resource;
    if (!resource) {
      return;
    }
    const _resource = resource as Resource;

    let hasChange = false;

    if (_resource.id !== (id || undefined)) {
      hasChange = true;
    }
    if (JSON.stringify(_resource.fields) !== JSON.stringify(fields)) {
      hasChange = true;
    }

    if (hasChange) {
      this.createResource();
    }
  }

  render(): React.ReactNode {
    const resource = this.state.resource;
    if (!resource) {
      return 'not initialized';
    }
    return this.props.render(resource);
  }
}
