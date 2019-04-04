import * as React from 'react';

import {
  ResourceCollection,
  ResourceCollectionConfig
} from '../ResourceCollection';

import { DataSourceArgumentMap } from '../DataSource';
import { SortInfo } from '../DataSourceRequest';
import { observer } from 'mobx-react';

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
  resource?: ResourceCollection;
}

@observer
export class ResourceCollectionLayer extends React.Component<
  ResourceCollectionLayerProps,
  ResourceCollectionLayerState
> {
  state: ResourceCollectionLayerState = {
    resource: undefined
  };

  handleError = (error: Error) => {
    throw error;
  };

  createResource() {
    const { render, ...props } = this.props;

    const resource = new ResourceCollection(props);
    if (this.props.autoload || typeof this.props.autoload === 'undefined') {
      resource.get().catch(this.handleError);
    }
    this.setState({ resource });
    resource.startPolling();
  }

  componentDidMount() {
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

    if (hasChange) this.reload();
  }

  reload() {
    const resource = this.state.resource;
    if (!resource) {
      return;
    }
    const _resource = resource as ResourceCollection;
    _resource.get().catch(this.handleError);
  }

  render() {
    const { resource } = this.state;

    if (!resource) {
      return 'Resource not initialized';
    }
    return this.props.render(resource);
  }
}
