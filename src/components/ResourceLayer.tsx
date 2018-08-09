import * as React from 'react';
import { Resource, ResourceConfig } from '../Resource';
import { observer } from 'mobx-react';

export interface ResourceLayerProps extends ResourceConfig {
  autoload?: boolean;
  render: (resource: Resource) => React.ReactNode;
}

export interface ResourceLayerState {
  errors: Error[];
  resource?: Resource;
}

@observer
export class ResourceLayer extends React.Component<
  ResourceLayerProps,
  ResourceLayerState
> {
  state = { errors: [], resource: undefined };

  handleError = (err: Error) => {
    console.log('error?!', err);
    // let errors: Error[] = [];
    // if (isConnectorError(err)) {
    //   errors = err.errors;
    // } else {
    //   errors = [err];
    // }
    // this.setState({
    //   errors: Array.prototype.concat(...this.state.errors, ...errors)
    // });
  };
  createResource() {
    const { render, ...props } = this.props;

    const resource = new Resource(props);

    if (this.props.autoload || typeof this.props.autoload === 'undefined') {
      resource.getIfHasID().catch(this.handleError);
    }

    this.setState({ resource });
  }

  componentWillMount() {
    this.createResource();
  }

  render() {
    const resource = this.state.resource;
    if (!resource) {
      return 'not initialized';
    }
    return this.props.render(resource);
  }
}
