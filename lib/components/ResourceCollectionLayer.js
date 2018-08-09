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
import { ResourceCollection } from '../ResourceCollection';
import { observer } from 'mobx-react';
var ResourceCollectionLayer = /** @class */ (function (_super) {
    __extends(ResourceCollectionLayer, _super);
    function ResourceCollectionLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { errors: [], resource: undefined };
        _this.handleError = function (err) {
            console.log('error?!', err);
        };
        return _this;
    }
    ResourceCollectionLayer.prototype.createResource = function () {
        var _a = this.props, render = _a.render, props = __rest(_a, ["render"]);
        var resource = new ResourceCollection(props);
        if (this.props.autoload || typeof this.props.autoload === 'undefined') {
            resource.get().catch(this.handleError);
        }
        this.setState({ resource: resource });
    };
    ResourceCollectionLayer.prototype.componentWillMount = function () {
        this.createResource();
    };
    ResourceCollectionLayer.prototype.render = function () {
        var resource = this.state.resource;
        if (!resource) {
            return 'not initialized';
        }
        return this.props.render(resource);
    };
    ResourceCollectionLayer = __decorate([
        observer
    ], ResourceCollectionLayer);
    return ResourceCollectionLayer;
}(React.Component));
export { ResourceCollectionLayer };
//# sourceMappingURL=ResourceCollectionLayer.js.map