var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from 'react';
// import { ResourceStore } from '../store/ResourceStore';
import { Resource } from '../Resource';
import { observer } from 'mobx-react';
// export interface ResourceLayerState {
//   errors: Error[];
//   resource?: Resource;
// }
var ResourceLayer = /** @class */ (function (_super) {
    __extends(ResourceLayer, _super);
    function ResourceLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //   static propTypes = {
        //     config: PropTypes.shape({
        //       resources: PropTypes.object.isRequired
        //     })
        //   };
        //   store = new ResourceStore();
        _this.state = { errors: [], resource: undefined };
        //   refreshTimer?: number = undefined;
        _this.handleError = function (err) {
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
        return _this;
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
    ResourceLayer.prototype.createResource = function () {
        var _a = this.props, render = _a.render, props = __rest(_a, ["render"]);
        var resource = new Resource(props);
        resource.getIfHasID().catch(this.handleError);
        // this.setState({ resource });
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
    };
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
    ResourceLayer.prototype.componentWillMount = function () {
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
    };
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
    ResourceLayer.prototype.render = function () {
        var resource = this.state.resource;
        if (!resource) {
            return 'not initialized';
        }
        return this.props.render(resource);
    };
    ResourceLayer = __decorate([
        observer
        // ResourceLayerState
    ], ResourceLayer);
    return ResourceLayer;
}(React.Component));
export { ResourceLayer };
//# sourceMappingURL=ResourceLayer.js.map