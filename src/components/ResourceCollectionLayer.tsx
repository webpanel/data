import * as React from 'react';
import {
  ResourceCollection,
  ResourceCollectionConfig
} from '../ResourceCollection';
import { observer } from 'mobx-react';

export interface ResourceCollectionLayerConfig
  extends ResourceCollectionConfig {
  render: (resource: ResourceCollection) => React.ReactNode;
}

@observer
export class ResourceCollectionLayer extends React.Component<
  ResourceCollectionLayerConfig
> {
  state = { errors: [], resource: undefined };

  handleError = (err: Error) => {
    console.log('error?!', err);
  };
  createResource() {
    const { render, ...props } = this.props;

    const resource = new ResourceCollection(props);
    resource.get().catch(this.handleError);

    // this.setState({ resource });
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
