var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
import { AuthSession } from 'webpanel-auth';
import { GraphQLConnector } from './utils/networking/GraphQLConnector';
import { GraphQLQuery, GraphQLField } from './utils/networking/GraphQLQuery';
// import { AuthSession } from '../store/AuthSession';
import { isConnectorError } from './utils/networking/Connector';
export var DataSourceOperation;
(function (DataSourceOperation) {
    DataSourceOperation["list"] = "list";
    DataSourceOperation["create"] = "create";
    DataSourceOperation["read"] = "read";
    DataSourceOperation["update"] = "update";
    DataSourceOperation["delete"] = "delete";
})(DataSourceOperation || (DataSourceOperation = {}));
var connectors = {
    graphql: new GraphQLConnector()
};
var DataSource = /** @class */ (function () {
    function DataSource(name, type, url) {
        this.name = name;
        this.type = type;
        this.url = url;
    }
    DataSource.prototype.getConnector = function () {
        var conn = connectors[this.type];
        if (!conn) {
            throw new Error("unknown data source type " + this.type);
        }
        return conn;
    };
    DataSource.prototype.list = function (name, fields, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send(DataSourceOperation.list, name, fields, args)];
            });
        });
    };
    DataSource.prototype.create = function (name, data, fields) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send(DataSourceOperation.create, name, fields, { input: data })];
            });
        });
    };
    DataSource.prototype.read = function (name, id, fields, args) {
        return __awaiter(this, void 0, void 0, function () {
            var _args;
            return __generator(this, function (_a) {
                args = args || {};
                _args = __assign({}, args);
                if (id)
                    _args.id = id;
                return [2 /*return*/, this.send(DataSourceOperation.read, name, fields, _args)];
            });
        });
    };
    DataSource.prototype.update = function (name, id, data, fields) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send(DataSourceOperation.update, name, fields, {
                        id: id,
                        input: data
                    })];
            });
        });
    };
    DataSource.prototype.delete = function (name, id, fields) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send(DataSourceOperation.delete, name, fields, { id: id })];
            });
        });
    };
    DataSource.prototype.fillFieldsFromObject = function (field, obj) {
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
    DataSource.prototype.fieldForOperation = function (operation, fetchFieldName, fields, args) {
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
    DataSource.prototype.send = function (operation, name, fields, args) {
        if (args === void 0) { args = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var fetchFieldName, query, field, res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchFieldName = inflection.camelize(inflection.pluralize(name), true);
                        switch (operation) {
                            case 'read':
                                fetchFieldName = inflection.camelize(inflection.singularize(name), true);
                                break;
                            case 'create':
                                fetchFieldName = "create" + name;
                                break;
                            case 'update':
                                fetchFieldName = "update" + name;
                                break;
                            case 'delete':
                                fetchFieldName = "delete" + name;
                                break;
                            default:
                        }
                        query = new GraphQLQuery(operation === 'read' || operation === 'list' ? 'query' : 'mutation', 'operation');
                        field = this.fieldForOperation(operation, fetchFieldName, fields, args);
                        query.field(field);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getConnector().send(this.url, query)];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/, res.data && res.data[fetchFieldName]];
                    case 3:
                        err_1 = _a.sent();
                        if (isConnectorError(err_1)) {
                            if (err_1.authorization) {
                                AuthSession.current().logout();
                                return [2 /*return*/];
                            }
                        }
                        throw err_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DataSource;
}());
export { DataSource };
// export class DataSourceProvider {
//   static _shared: DataSourceProvider;
//   datasources: { [key: string]: DataSource } = {};
//   static shared() {
//     if (typeof this._shared === 'undefined') {
//       this._shared = new DataSourceProvider();
//     }
//     return this._shared;
//   }
//   constructor() {
//     // const rootConfig = ConfigProvider.getConfig('root');
//     // const dataSourcesConfig = rootConfig.datasources as { [key: string]: any };
//     // for (let name of Object.keys(dataSourcesConfig)) {
//     //   const conf = dataSourcesConfig[name];
//     //   this.datasources[name] = new DataSource(name, conf.type, conf.url);
//     // }
//   }
//   getDataSource(name: string): DataSource {
//     const ds = this.datasources[name];
//     if (typeof ds === 'undefined') {
//       throw new Error(`datasource ${name} not found`);
//     }
//     return ds;
//   }
// }
//# sourceMappingURL=DataSource.js.map