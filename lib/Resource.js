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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { ResourceBase } from './ResourceBase';
var Resource = /** @class */ (function (_super) {
    __extends(Resource, _super);
    function Resource(config) {
        var _this = _super.call(this, config) || this;
        // this hash is used to simulate "cancelling" behaviour of loading requests
        // it's compared with the latest generated requst hash to make sure that resource collection displays only latest loading request
        // this is required in case of multiple get calls with different params (eg. autocompletion)
        _this.updatingHash = '';
        _this.patchHash = '';
        _this.getIfHasID = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.id) {
                    return [2 /*return*/, this.get()];
                }
                return [2 /*return*/];
            });
        }); };
        _this.get = function () { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.id) {
                            throw new Error('resource id is missing');
                        }
                        return [4 /*yield*/, this.tryWithLoading(this.dataSource.read(this.name, this.id, this.fields, this.arguments))];
                    case 1:
                        res = _a.sent();
                        this.initialized = true;
                        this.data = res;
                        return [2 /*return*/, res];
                }
            });
        }); };
        _this.create = function (values) { return __awaiter(_this, void 0, void 0, function () {
            var fields, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        values = Object.assign({}, this.data, values);
                        fields = (this.fields || []).slice();
                        if (fields.indexOf('id') === -1) {
                            fields.push('id');
                        }
                        return [4 /*yield*/, this.tryWithLoading(this.dataSource.create(this.name, values, fields, this.arguments), false)];
                    case 1:
                        res = _a.sent();
                        this.data = res;
                        this.id = res.id;
                        if (this.onCreate) {
                            this.onCreate(res.id, res);
                        }
                        return [2 /*return*/, res];
                }
            });
        }); };
        // deprecated, please use put
        _this.update = function (values) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.put(values)];
            });
        }); };
        _this.put = function (values) { return __awaiter(_this, void 0, void 0, function () {
            var currentHash, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.id) {
                            throw new Error('resource id is missing');
                        }
                        values = Object.assign({}, this.data, values);
                        currentHash = Math.random()
                            .toString(36)
                            .substring(2);
                        this.updatingHash = currentHash;
                        return [4 /*yield*/, this.tryWithLoading(this.dataSource.update(this.name, this.id, values, this.fields, this.arguments), false)];
                    case 1:
                        res = _a.sent();
                        if (this.updatingHash == currentHash) {
                            this.data = res;
                        }
                        if (this.onUpdate) {
                            this.onUpdate(res);
                        }
                        return [2 /*return*/, res];
                }
            });
        }); };
        // deprecated, use patch
        _this.updateValues = function (props) { return __awaiter(_this, void 0, void 0, function () {
            var values, rest;
            return __generator(this, function (_a) {
                values = props.values, rest = __rest(props, ["values"]);
                return [2 /*return*/, this.patch(values, rest)];
            });
        }); };
        _this.patch = function (values, props) { return __awaiter(_this, void 0, void 0, function () {
            var currentHash, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.id) {
                            throw new Error('resource id is missing');
                        }
                        currentHash = Math.random()
                            .toString(36)
                            .substring(2);
                        this.patchHash = currentHash;
                        return [4 /*yield*/, this.tryWithLoading(this.dataSource.update(this.name, this.id, values, (props && props.fields) || this.fields, this.arguments))];
                    case 1:
                        res = _a.sent();
                        if (this.patchHash == currentHash) {
                            this.data = Object.assign({}, this.data, res);
                        }
                        if (this.onUpdate) {
                            this.onUpdate(res);
                        }
                        return [2 /*return*/, res];
                }
            });
        }); };
        _this.delete = function () { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.id) {
                            throw new Error('resource id is missing');
                        }
                        return [4 /*yield*/, this.tryWithLoading(this.dataSource.delete(this.name, this.id, this.fields, this.arguments))];
                    case 1:
                        res = _a.sent();
                        this.data = res;
                        if (this.onDelete) {
                            this.onDelete(res);
                        }
                        return [2 /*return*/, res];
                }
            });
        }); };
        _this.isPersisted = function () {
            return !!_this.id;
        };
        _this.save = function (values) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                values = Object.assign({}, this.data, values);
                if (!this.id) {
                    return [2 /*return*/, this.create(values)];
                }
                return [2 /*return*/, this.update(values)];
            });
        }); };
        _this.id = config.id || undefined;
        _this.onCreate = config.onCreate;
        _this.onUpdate = config.onUpdate;
        _this.onDelete = config.onDelete;
        if (!_this.id) {
            _this.data = config.initialValues;
        }
        return _this;
    }
    Resource.prototype.tryWithLoading = function (p, saveError) {
        if (saveError === void 0) { saveError = true; }
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.error = undefined;
                        this.loading = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, p];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_1 = _a.sent();
                        if (saveError) {
                            this.error = err_1;
                        }
                        throw err_1;
                    case 4:
                        this.loading = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Resource;
}(ResourceBase));
export { Resource };
//# sourceMappingURL=Resource.js.map