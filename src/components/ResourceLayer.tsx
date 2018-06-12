import * as React from 'react';
// import { ResourceStore } from '../store/ResourceStore';
import { Resource, ResourceConfig } from '../Resource';
import { observer } from 'mobx-react';
// import {
//   ResourceCollection,
//   ResourceCollectionConfig
// } from '../store/ResourceCollection';
// // import { Broadcast, Subscriber } from 'react-broadcast';
// // import { ContextObserver } from '../components/Context';
// // import { renderTemplate, evaluateObject, evaluate } from '../utils/StringUtils';
import { isConnectorError } from '../utils/networking/Connector';

// // import { Spin } from 'antd';

export interface ResourceLayerConfig {
  render: (data: Resource) => React.ReactNode;
  config: ResourceConfig; // | ResourceCollectionConfig;
  //   resources: {
  //     [key: string]: (ResourceConfig | ResourceCollectionConfig) & {
  //       collection?: boolean;
  //     };
  //   };
  //   content: any;
  //   showLoading?: boolean;
  //   autoRefresh?: string;
}

export interface ResourceLayerState {
  errors: Error[];
  resource?: Resource;
}

@observer
export class ResourceLayer extends React.Component<
  ResourceLayerConfig,
  ResourceLayerState
> {
  //   static propTypes = {
  //     config: PropTypes.shape({
  //       resources: PropTypes.object.isRequired
  //     })
  //   };
  //   store = new ResourceStore();
  state = { errors: [], resource: undefined };
  //   refreshTimer?: number = undefined;

  handleError = (err: Error) => {
    // console.log('error?!', err);
    let errors: Error[] = [];
    if (isConnectorError(err)) {
      errors = err.errors;
    } else {
      errors = [err];
    }
    this.setState({
      errors: Array.prototype.concat(...this.state.errors, ...errors)
    });
  };
  createResource() {
    const { config } = this.props;

    const resource = new Resource(config);
    resource.getIfHasID().catch(this.handleError);

    this.setState({ resource });

    // if (config.resources) {
    //   for (let key of Object.keys(config.resources)) {
    //     const resourceConfig = Object.assign({}, config.resources[key]);
    //     if (resourceConfig.collection) {
    //       const resource = new ResourceCollection(resourceConfig);
    //       this.store.setResource(key, resource);
    //       // resource.get().catch(this.handleError);
    //     } else {
    //       let conf = resourceConfig as ResourceConfig;
    //       const id = renderTemplate(conf.id, this.props.context);
    //       if (conf.defaultValues) {
    //         conf.defaultValues = evaluateObject(conf.defaultValues, context);
    //       }
    //       conf = Object.assign({}, resourceConfig, { id });
    //       const resource = new Resource(conf);
    //       this.store.setResource(key, resource);
    //       resource.getIfHasID().catch(this.handleError);
    //     }
    //   }
    // }
  }
  //   refreshResources = (force: boolean = false) => {
  //     const { config, context } = this.props;
  //     for (let key of Object.keys(this.store.resources)) {
  //       const resource = this.store.resources[key];
  //       const resourceConfig = config.resources[key];
  //       if (resource instanceof ResourceCollection) {
  //         if (resourceConfig.args) {
  //           const newArgs = evaluateObject(resourceConfig.args, {
  //             resources: this.store.resources,
  //             ...context
  //           });
  //           if (JSON.stringify(resource.args) !== JSON.stringify(newArgs)) {
  //             resource.setArgs(newArgs);
  //           }
  //           // }else {
  //           //   resource.
  //         }
  //         if (force) {
  //           resource.reload().catch(this.handleError);
  //         } else {
  //           resource.reloadIfNeeded().catch(this.handleError);
  //         }
  //         // } else if (resource instanceof Resource) {
  //         //   let conf = resourceConfig as ResourceConfig;
  //         //   if (conf.defaultValues) {
  //         //     resource.defaultValues = renderObject(conf.defaultValues, context);
  //         //   }
  //         //   resource.getIfHasID().catch(this.handleError);
  //       }
  //     }
  //   };
  componentWillMount() {
    //   const { context, config } = this.props;
    this.createResource();
    //     this.refreshResources();
    //     // console.log('did mount', this.props.config.resources);
    //     if (config.autoRefresh) {
    //       const refreshInterval = evaluate(config.autoRefresh, context);
    //       const refreshFn = () => {
    //         this.refreshResources(true);
    //       };
    //       this.refreshTimer = setInterval(refreshFn, refreshInterval);
    //     }
  }
  //   componentWillUnmount() {
  //     const config = this.props.config as ResourceLayerConfig;
  //     // console.log('will unmount', config.resources);
  //     if (config.resources) {
  //       for (let key of Object.keys(config.resources)) {
  //         this.store.destroyResource(key);
  //       }
  //     }
  //     if (this.refreshTimer) {
  //       clearInterval(this.refreshTimer);
  //       this.refreshTimer = undefined;
  //     }
  //   }
  //   componentWillReceiveProps() {
  //     setTimeout(this.refreshResources, 0);
  //   }
  //   renderContent() {
  //     let resources = this.props.context.resources || {};
  //     resources = { ...resources, ...this.store.resources };
  //     const ctx = Object.assign({}, this.props.context, { resources });
  //     // console.log('resource context', ctx);
  //     return (
  //       <Broadcast channel="context" value={ctx}>
  //         <Renderer content={this.props.config.content} />
  //       </Broadcast>
  //     );
  //   }
  //   renderErrors(errors: Error[]) {
  //     return errors.map(err => err.message);
  //   }
  render() {
    const resource = this.state.resource;
    if (!resource) {
      return 'not initialized';
    }
    return this.props.render(resource);
  }
  //     // setTimeout(this.refreshResources, 0);
  //     const { errors } = this.state;
  //     if (
  //       this.props.config.showLoading &&
  //       this.store.numberOfLoadingResources() > 0
  //     ) {
  //       return <Spin style={{ width: '100%', height: '100%' }} />;
  //     }
  //     const content =
  //       errors.length === 0 ? this.renderContent() : this.renderErrors(errors);
  //     return content;
  //   }
}
