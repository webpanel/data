import { cloneDeep } from 'lodash';
export var DataSourceOperation;
(function (DataSourceOperation) {
    DataSourceOperation["list"] = "list";
    DataSourceOperation["create"] = "create";
    DataSourceOperation["read"] = "read";
    DataSourceOperation["update"] = "update";
    DataSourceOperation["delete"] = "delete";
})(DataSourceOperation || (DataSourceOperation = {}));
var DataSourceRequest = /** @class */ (function () {
    function DataSourceRequest(variables) {
        if (variables === void 0) { variables = {}; }
        this.offset = 0;
        this.fields = {};
        this.filters = {};
        this.sorting = [];
        this.id = undefined;
        this.data = undefined;
        this.arguments = {};
        var cloned = cloneDeep(variables);
        this.name = cloned.name;
        this.url = cloned.url || null;
        this.operation = cloned.operation;
        this.offset = cloned.offset || 0;
        this.limit = cloned.limit;
        this.fields = cloned.fields || {};
        this.filters = cloned.filters || {};
        this.sorting = cloned.sorting || [];
        this.id = variables.id;
        this.data = variables.data;
        this.arguments = cloned.arguments;
    }
    return DataSourceRequest;
}());
export { DataSourceRequest };
//# sourceMappingURL=DataSourceRequest.js.map