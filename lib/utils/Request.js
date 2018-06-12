import { cloneDeep } from 'lodash';
var Request = /** @class */ (function () {
    function Request(variables) {
        if (variables === void 0) { variables = {}; }
        this.page = 0;
        this.limit = null;
        this.fields = {};
        this.filters = {};
        this.headers = {};
        this.sorting = [];
        this.params = [];
        var cloned = cloneDeep(variables);
        this.url = cloned.url || null;
        this.data = cloned.data || {};
        this.page = cloned.page;
        this.filters = cloned.filters || {};
        this.headers = cloned.headers || {};
        this.sorting = cloned.sorting || [];
        this.params = cloned.params || [];
    }
    Request.prototype.getPage = function (pageCursor) {
        var req = new Request(this);
        if (pageCursor) {
            req.page = pageCursor;
        }
        return req;
    };
    Request.prototype.field = function (variable, value) {
        var req = new Request(this);
        req.fields[variable] = value;
        return req;
    };
    Request.prototype.withFields = function (fields) {
        var req = new Request(this);
        req.fields = fields;
        return req;
    };
    Request.prototype.filter = function (variable, value) {
        var req = new Request(this);
        req.filters[variable] = value;
        return req;
    };
    Request.prototype.withFilters = function (filters) {
        var req = new Request(this);
        req.filters = filters;
        return req;
    };
    Request.prototype.paginate = function (limit) {
        var req = new Request(this);
        req.limit = limit;
        if (!limit) {
            req.page = null;
        }
        return req;
    };
    Request.prototype.sort = function (array) {
        var req = new Request(this);
        req.sorting = array;
        return req;
    };
    Request.prototype.withParams = function (params) {
        var req = new Request(this);
        req.params = params;
        return req;
    };
    return Request;
}());
export { Request };
//# sourceMappingURL=Request.js.map