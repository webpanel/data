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
import { DataSourceRequest, isConnectorError } from './connectors/Connector';
import { AuthSession } from 'webpanel-auth';
// import { HTTPResponse } from './utils/HTTPResponse';
import { DataSourceOperation } from './DataSourceRequest';
var DataSource = /** @class */ (function () {
    function DataSource(name, connector, url) {
        this.name = name;
        this.connector = connector;
        this.url = url;
    }
    DataSource.prototype.list = function (name, fields, filters, search, sorting, offset, limit, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send({
                        operation: DataSourceOperation.list,
                        name: name,
                        fields: fields,
                        filters: filters,
                        search: search,
                        sorting: sorting,
                        offset: offset,
                        limit: limit,
                        args: args
                    })];
            });
        });
    };
    DataSource.prototype.create = function (name, data, fields, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send({
                        operation: DataSourceOperation.create,
                        name: name,
                        fields: fields,
                        data: data,
                        args: args
                    })];
            });
        });
    };
    DataSource.prototype.read = function (name, id, fields, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send({
                        operation: DataSourceOperation.read,
                        name: name,
                        fields: fields,
                        id: id,
                        args: args
                    })];
            });
        });
    };
    DataSource.prototype.update = function (name, id, data, fields, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send({
                        operation: DataSourceOperation.update,
                        name: name,
                        fields: fields,
                        id: id,
                        data: data,
                        args: args
                    })];
            });
        });
    };
    DataSource.prototype.delete = function (name, id, fields, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send({
                        operation: DataSourceOperation.delete,
                        name: name,
                        fields: fields,
                        id: id,
                        args: args
                    })];
            });
        });
    };
    DataSource.prototype.send = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var dataSourceRequest, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dataSourceRequest = new DataSourceRequest({
                            name: params.name,
                            url: this.url,
                            operation: params.operation,
                            id: params.id,
                            data: params.data,
                            fields: params.fields,
                            filters: params.filters,
                            search: params.search,
                            sorting: params.sorting,
                            offset: params.offset,
                            limit: params.limit,
                            arguments: params.args
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connector.send(dataSourceRequest)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_1 = _a.sent();
                        if (isConnectorError(err_1)) {
                            if (err_1.authorization) {
                                AuthSession.current().logout();
                                return [2 /*return*/, null];
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
//# sourceMappingURL=DataSource.js.map