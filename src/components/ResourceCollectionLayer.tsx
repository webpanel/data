import * as React from 'react';
import {
  ResourceCollection,
  ResourceCollectionConfig
} from '../ResourceCollection';
import { observer } from 'mobx-react';

export interface ResourceCollectionLayerProps extends ResourceCollectionConfig {
  autoload?: boolean;
  render: (resource: ResourceCollection) => React.ReactNode;
}

export interface ResourceCollectionLayerState {
  errors: Error[];
  resource?: ResourceCollection;
}

@observer
export class ResourceCollectionLayer extends React.Component<
  ResourceCollectionLayerProps,
  ResourceCollectionLayerState
> {
  state = { errors: [], resource: undefined };

  handleError = (err: Error) => {
    // console.log('error?!', err);
  };

  createResource() {
    const { render, ...props } = this.props;

    const resource = new ResourceCollection(props);
    if (this.props.autoload || typeof this.props.autoload === 'undefined') {
      resource.get().catch(this.handleError);
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
