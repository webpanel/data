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
import { HTTPRequest, ConnectorError } from '../../connectors/Connector';
import { GraphQLQuery, GraphQLField } from './GraphQLQuery';
import { HTTPConnector } from '../HTTPConnector';
var GraphQLConnector = /** @class */ (function (_super) {
    __extends(GraphQLConnector, _super);
    function GraphQLConnector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GraphQLConnector.prototype.transformResponse = function (response, request) {
        return __awaiter(this, void 0, void 0, function () {
            var authorization_1, errors, fetchFieldName, data;
            return __generator(this, function (_a) {
                if (response.status === 401) {
                    throw new ConnectorError(true, [
                        new Error(this.getErrorMessageFromResponse(response))
                    ]);
                }
                if (response.data && response.data.errors) {
                    authorization_1 = false;
                    errors = response.data.errors.map(function (e) {
                        if (e.message === 'jwt must be provided' ||
                            e.message === 'jwt malformed') {
                            authorization_1 = true;
                        }
                        return new Error(e.message);
                    });
                    throw new ConnectorError(authorization_1, errors);
                }
                fetchFieldName = inflection.camelize(inflection.pluralize(request.name), true);
                data = response.data || response.data.data[fetchFieldName] || null;
                if (data === null) {
                    return [2 /*return*/, data];
                }
                return [2 /*return*/, this.responseTransformer.handle(request.operation, data)];
            });
        });
    };
    GraphQLConnector.prototype.transformRequest = function (request) {
        var fetchFieldName = inflection.camelize(inflection.pluralize(request.name), true);
        switch (request.operation) {
            case 'read':
                fetchFieldName = inflection.camelize(inflection.singularize(request.name), true);
                break;
            case 'create':
                fetchFieldName = "create" + request.name;
                break;
            case 'update':
                fetchFieldName = "update" + request.name;
                break;
            case 'delete':
                fetchFieldName = "delete" + request.name;
                break;
            default:
        }
        var query = new GraphQLQuery(request.operation === 'read' || request.operation === 'list'
            ? 'query'
            : 'mutation', 'operation');
        var field = this.fieldForOperation(request.operation, fetchFieldName, request.fields
        // {
        //   filter: request.filters
        // }
        );
        query.field(field);
        return new HTTPRequest({
            url: request.url,
            method: 'POST',
            data: JSON.stringify({ query: query.toString() })
        });
    };
    GraphQLConnector.prototype.transformData = function (res, request) {
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
        console.log(fetchFieldName);
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