var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observable } from 'mobx';
var ResourceBase = /** @class */ (function () {
    function ResourceBase(config) {
        this.loading = false;
        this.data = undefined;
        this.dataSource = config.dataSource;
        this.name = config.name;
        this.fields = config.fields;
    }
    __decorate([
        observable
    ], ResourceBase.prototype, "loading", void 0);
    __decorate([
        observable
    ], ResourceBase.prototype, "data", void 0);
    return ResourceBase;
}());
export { ResourceBase };
//# sourceMappingURL=ResourceBase.js.map