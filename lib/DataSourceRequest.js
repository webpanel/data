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
        this.page = 0;
        this.limit = null;
        this.fields = {};
        this.filters = {};
        // headers: { [key: string]: string } = {};
        this.sorting = [];
        // params: string[] = [];
        this.id = undefined;
        this.data = undefined;
        var cloned = cloneDeep(variables);
        this.name = cloned.name;
        this.url = cloned.url || null;
        this.operation = cloned.operation;
        this.page = cloned.page;
        this.fields = cloned.fields || {};
        this.filters = cloned.filters || {};
        // this.headers = cloned.headers || {};
        this.sorting = cloned.sorting || [];
        // this.params = cloned.params || [];
    }
    DataSourceRequest.prototype.getPage = function (pageCursor) {
        var req = new DataSourceRequest(this);
        if (pageCursor) {
            req.page = pageCursor;
        }
        return req;
    };
    DataSourceRequest.prototype.field = function (variable, value) {
        var req = new DataSourceRequest(this);
        req.fields[variable] = value;
        return req;
    };
    DataSourceRequest.prototype.withFields = function (fields) {
        var req = new DataSourceRequest(this);
        req.fields = fields;
        return req;
    };
    DataSourceRequest.prototype.filter = function (variable, value) {
        var req = new DataSourceRequest(this);
        req.filters[variable] = value;
        return req;
    };
    DataSourceRequest.prototype.withFilters = function (filters) {
        var req = new DataSourceRequest(this);
        req.filters = filters;
        return req;
    };
    DataSourceRequest.prototype.paginate = function (limit) {
        var req = new DataSourceRequest(this);
        req.limit = limit;
        if (!limit) {
            req.page = null;
        }
        return req;
    };
    DataSourceRequest.prototype.sort = function (array) {
        var req = new DataSourceRequest(this);
        req.sorting = array;
        return req;
    };
    return DataSourceRequest;
}());
export { DataSourceRequest };
//# sourceMappingURL=DataSourceRequest.js.map