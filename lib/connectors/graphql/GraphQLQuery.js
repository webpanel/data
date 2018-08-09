// use local version until: https://github.com/codemeasandwich/graphql-query-builder/pull/9
// import Query from './graphql-query';
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
import { SortInfoOrder } from '../../DataSourceRequest';
function isGraphQLArgumentMap(arg) {
    return arg !== null && typeof arg === 'object';
}
var GraphQLField = /** @class */ (function () {
    function GraphQLField(name) {
        this._fields = [];
        this._args = {};
        this.name = name;
    }
    GraphQLField.prototype.field = function (field) {
        if (typeof field === 'string') {
            field = new GraphQLField(field);
        }
        this._fields.push(field);
        return this;
    };
    GraphQLField.prototype.fields = function (fields) {
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var field = fields_1[_i];
            this.field(field);
        }
        return this;
    };
    GraphQLField.prototype.arg = function (key, value) {
        this._args[key] = value;
        return this;
    };
    GraphQLField.prototype.args = function (value) {
        this._args = value;
        return this;
    };
    GraphQLField.prototype.toString = function () {
        var str = this.name;
        if (Object.keys(this._args).length > 0) {
            var serializedArgs = this.serializeArgs(this._args);
            if (serializedArgs) {
                str += '(' + serializedArgs.substr(1, serializedArgs.length - 2) + ')';
            }
        }
        if (this._fields.length > 0) {
            str += ' {' + this._fields.map(function (x) { return x.toString(); }).join(' ') + '}';
        }
        return str + ' ';
    };
    GraphQLField.prototype.formatSortInfo = function (sorting) {
        return (sorting &&
            sorting.map(function (sort) {
                return sort.columnKey.toUpperCase() +
                    (sort.order === SortInfoOrder.descend ? '_DESC' : '');
            }));
    };
    GraphQLField.prototype.serializeArgs = function (args) {
        var res = [];
        for (var _i = 0, _a = Object.keys(args); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = args[key];
            var serialized = this.serializeArg(value);
            if (typeof serialized !== 'undefined') {
                if (key === 'filter' || key === 'sort') {
                    res.push(key + ":$" + key);
                }
                else {
                    res.push(key + ":" + serialized);
                }
            }
        }
        if (res.length === 0) {
            return null;
        }
        return "{" + res.join(',') + "}";
    };
    GraphQLField.prototype.serializeArg = function (value) {
        var _this = this;
        var res = undefined;
        if (Array.isArray(value)) {
            res = '[' + value.map(function (x) { return _this.serializeArg(x); }).join(',') + ']';
        }
        else if (typeof value === 'string') {
            res = JSON.stringify(value);
        }
        else if (isGraphQLArgumentMap(value)) {
            res = this.serializeArgs(value);
        }
        else {
            res = value;
        }
        return res;
    };
    Object.defineProperty(GraphQLField.prototype, "arguments", {
        get: function () {
            return Object.assign.apply(Object, [{},
                this._args].concat(this._fields.map(function (field) { return field.arguments; })));
        },
        enumerable: true,
        configurable: true
    });
    return GraphQLField;
}());
export { GraphQLField };
var GraphQLQuery = /** @class */ (function (_super) {
    __extends(GraphQLQuery, _super);
    function GraphQLQuery(type, name) {
        var _this = _super.call(this, name) || this;
        _this.type = type;
        return _this;
    }
    GraphQLQuery.prototype.toString = function () {
        return JSON.stringify({
            query: this.type + ' ' + _super.prototype.toString.call(this),
            variables: this.variables
        });
    };
    Object.defineProperty(GraphQLQuery.prototype, "variables", {
        get: function () {
            var args = this.arguments;
            var processedArgs = {};
            for (var key in args) {
                if (key === 'sort' || key === 'filter') {
                    processedArgs["" + key] =
                        key === 'sort' ? this.formatSortInfo(args[key]) : args[key];
                }
            }
            return processedArgs;
        },
        enumerable: true,
        configurable: true
    });
    return GraphQLQuery;
}(GraphQLField));
export { GraphQLQuery };
//# sourceMappingURL=GraphQLQuery.js.map