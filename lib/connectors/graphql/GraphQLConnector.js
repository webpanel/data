var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as inflection from 'inflection';
import { ConnectorError, DataSourceOperation, HTTPRequest } from '../../connectors/Connector';
import { GraphQLField, GraphQLQuery } from './GraphQLQuery';
import { SortInfoOrder } from '../../DataSourceRequest';
import { HTTPConnector } from '../HTTPConnector';
var GraphQLConnector = /** @class */ (function (_super) {
    __extends(GraphQLConnector, _super);
    function GraphQLConnector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GraphQLConnector.prototype.filterInputTypeName = function (request) {
        var fieldName = this.fetchFieldNameForRequest(request);
        return inflection.singularize(inflection.camelize(fieldName, false)) + "FilterType";
    };
    GraphQLConnector.prototype.sortInputTypeName = function (request) {
        var fieldName = this.fetchFieldNameForRequest(request);
        return inflection.singularize(inflection.camelize(fieldName, false)) + "SortType";
    };
    GraphQLConnector.prototype.inputTypeName = function (request) {
        return inflection.singularize(inflection.camelize(request.name, false)) + "Raw" + inflection.camelize(request.operation) + "Input";
    };
    GraphQLConnector.prototype.sortFormatName = function (sort) {
        return (sort.columnKey.toUpperCase() +
            (sort.order === SortInfoOrder.descend ? '_DESC' : '_ASC'));
    };
    GraphQLConnector.prototype.sendHttpRequest = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.sendHttpRequest.call(this, request)];
                    case 1:
                        res = _a.sent();
                        if (res.status == 401) {
                            throw new ConnectorError(true, [
                                new Error(this.getErrorMessageFromResponse(res))
                            ]);
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    GraphQLConnector.prototype.transformResponse = function (response, request) {
        return __awaiter(this, void 0, void 0, function () {
            var authorization_1, errors, fetchFieldName, data;
            return __generator(this, function (_a) {
                if (response.data && response.data.errors) {
                    authorization_1 = false;
                    errors = response.data.errors.map(function (e) {
                        if (e.message === 'jwt must be provided' ||
                            e.message === 'jwt malformed' ||
                            e.code === 'UNAUTHORIZED' ||
                            e.authorization) {
                            authorization_1 = true;
                        }
                        return new Error(e.message);
                    });
                    throw new ConnectorError(authorization_1, errors);
                }
                fetchFieldName = this.fetchFieldNameForRequest(request);
                data = response.data && response.data.data && response.data.data[fetchFieldName];
                if (null === data) {
                    return [2 /*return*/, data];
                }
                return [2 /*return*/, this.responseTransformer.handle(request.operation, data)];
            });
        });
    };
    GraphQLConnector.prototype.fetchFieldNameForRequest = function (request) {
        var fetchFieldName = inflection.camelize(inflection.pluralize(request.name), true);
        var entityName = inflection.camelize(inflection.singularize(request.name), false);
        switch (request.operation) {
            case DataSourceOperation.read:
                fetchFieldName = inflection.camelize(inflection.singularize(request.name), true);
                break;
            case DataSourceOperation.create:
                fetchFieldName = "create" + entityName;
                break;
            case DataSourceOperation.update:
                fetchFieldName = "update" + entityName;
                break;
            case DataSourceOperation.delete:
                fetchFieldName = "delete" + entityName;
                break;
            default:
        }
        return fetchFieldName;
    };
    GraphQLConnector.prototype.transformRequest = function (request) {
        var _this = this;
        var fetchFieldName = this.fetchFieldNameForRequest(request);
        var filter = {};
        for (var _i = 0, _a = Object.keys(request.filters); _i < _a.length; _i++) {
            var filterName = _a[_i];
            for (var _b = 0, _c = Object.keys(request.filters[filterName]); _b < _c.length; _b++) {
                var key = _c[_b];
                filter[key] = request.filters[filterName][key];
            }
        }
        var args = request.operation === DataSourceOperation.list
            ? {
                filter: filter,
                q: request.search,
                offset: request.offset,
                limit: request.limit,
                sort: request.sorting
            }
            : { id: request.id, input: request.data };
        var query = new GraphQLQuery(request.operation === 'read' || request.operation === 'list'
            ? 'query'
            : 'mutation', this.generateQueryParams(request, args), {
            sortingFormatter: function (sorting) {
                var splitSorting = [];
                for (var _i = 0, sorting_1 = sorting; _i < sorting_1.length; _i++) {
                    var _sorting = sorting_1[_i];
                    for (var _a = 0, _b = _sorting.columnKey.split(','); _a < _b.length; _a++) {
                        var s = _b[_a];
                        splitSorting.push(__assign({}, _sorting, { columnKey: s }));
                    }
                }
                return splitSorting.map(function (x) { return _this.sortFormatName(x); });
            }
        });
        var field = this.fieldForOperation(request.operation, fetchFieldName, request.fields, args);
        query.field(field);
        return new HTTPRequest({
            url: request.url,
            method: 'POST',
            data: query.toString()
        });
    };
    GraphQLConnector.prototype.generateQueryParams = function (request, args) {
        var _this = this;
        var fieldName = this.fetchFieldNameForRequest(request);
        var str = fieldName;
        var header = Object
            .keys(args)
            .map(function (key) {
            switch (key) {
                case 'filter':
                    if (!args[key])
                        return '';
                    return "$" + key + ": " + _this.filterInputTypeName(request);
                case 'sort':
                    if (!args[key])
                        return '';
                    return "$" + key + ": [" + _this.sortInputTypeName(request) + "!]";
                case 'input':
                    if (!args[key])
                        return '';
                    return "$" + key + ": " + _this.inputTypeName(request) + "!";
                default:
                    return '';
            }
        })
            .filter(function (x) { return !!x; })
            .join(',');
        if (header) {
            header = "(" + header + ")";
        }
        return str + header;
    };
    GraphQLConnector.prototype.transformData = function (res, request) {
        if (!res.data) {
            return null;
        }
        var keys = Object.keys(res.data.data);
        return res.data.data[keys[0]];
    };
    GraphQLConnector.prototype.fillFieldsFromObject = function (field, obj) {
        if (Array.isArray(obj)) {
            for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
                var f = obj_1[_i];
                this.fillFieldsFromObject(field, f);
            }
        }
        else if (typeof obj === 'object') {
            for (var _a = 0, _b = Object.keys(obj); _a < _b.length; _a++) {
                var key = _b[_a];
                var f = new GraphQLField(key);
                field.field(f);
                this.fillFieldsFromObject(f, obj[key]);
            }
        }
        else if (typeof obj === 'string') {
            field.field(new GraphQLField(obj));
        }
    };
    GraphQLConnector.prototype.fieldForOperation = function (operation, fetchFieldName, fields, args) {
        if (args === void 0) { args = {}; }
        var field = new GraphQLField(fetchFieldName);
        if (operation === 'list') {
            var entityItemsField = new GraphQLField('items');
            field.field(entityItemsField);
            field.field('count');
            if (args) {
                field.args(args);
            }
            this.fillFieldsFromObject(entityItemsField, fields);
        }
        else {
            this.fillFieldsFromObject(field, fields);
            if (args) {
                field.args(args);
            }
        }
        return field;
    };
    return GraphQLConnector;
}(HTTPConnector));
export { GraphQLConnector };
//# sourceMappingURL=GraphQLConnector.js.map