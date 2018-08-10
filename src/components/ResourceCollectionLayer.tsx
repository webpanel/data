import * as React from 'react';
import {
  ResourceCollection,
  ResourceCollectionConfig
} from '../ResourceCollection';
import { observer } from 'mobx-react';
import { DataSourceArgumentMap } from '../DataSource';
import { SortInfo } from '../DataSourceRequest';

export interface ResourceCollectionLayerProps extends ResourceCollectionConfig {
  autoload?: boolean;
  render: (resource: ResourceCollection) => React.ReactNode;

  // observed properties
  values?: {
    filters?: DataSourceArgumentMap;
    search?: string;
    sorting?: SortInfo[];
    offset?: number;
    limit?: number;
  };
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
  state = {
    errors: [],
    resource: undefined
  };

  handleError = (err: Error) => {
    throw err;
  };

  createResource() {
    const { render, ...props } = this.props;

    const resource = new ResourceCollection(props);
    if (this.props.autoload || typeof this.props.autoload === 'undefined') {
      resource.get().catch(this.handleError);
    }
    this.setState({ resource });
  }

  componentDidMount() {
    this.createResource();
  }

  componentDidUpdate(prevProps: Readonly<ResourceCollectionLayerProps>) {
    if (!this.props.values) {
      return;
    }
    const { filters, search, sorting, offset, limit } = this.props.values;

    const resource = this.state.resource;
    if (!resource) {
      return;
    }
    const _resource = resource as ResourceCollection;

    let hasChange = false;

    if (_resource.namedFilter('$_layer') !== filters) {
      _resource.updateNamedFilters('$_layer', filters, false);
      hasChange = true;
    }
    if (_resource.search !== search) {
      _resource.updateSearch(search, false);
      hasChange = true;
    }
    if (_resource.sorting !== sorting) {
      _resource.updateSorting(sorting, false);
      hasChange = true;
    }
    if (_resource.offset !== offset) {
      _resource.updateOffset(offset, false);
      hasChange = true;
    }
    if (_resource.limit !== limit) {
      _resource.updateLimit(limit, false);
      hasChange = true;
    }

    if (hasChange) _resource.get();
  }

  render() {
    const resource = this.state.resource;
    if (!resource) {
      return 'Resource not initialized';
    }
    return this.props.render(resource);
  }
}
