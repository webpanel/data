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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
import { Resource } from "./Resource";
import { ResourceBase, } from "./ResourceBase";
var ResourceCollection = /** @class */ (function (_super) {
    __extends(ResourceCollection, _super);
    function ResourceCollection(config) {
        var _this = _super.call(this, config) || this;
        _this.count = undefined;
        _this.hasFilterChanges = false;
        // this hash is used to simulate "cancelling" behaviour of loading requests
        // it's compared with the latest generated requst hash to make sure that resource collection displays only latest loading request
        // this is required in case of multiple get calls with different params (eg. autocompletion)
        _this.loadingHash = "";
        _this.autopersistConfig = function () {
            if (_this.autopersistConfigKey) {
                var config = {
                    filters: _this.filters,
                    search: _this.search,
                    sorting: _this.sorting,
                    offset: _this.offset,
                    limit: _this.limit,
                };
                var storage = sessionStorage || localStorage;
                if (storage)
                    storage.setItem(_this.autopersistConfigKey, JSON.stringify(config));
            }
        };
        _this.get = function () { return __awaiter(_this, void 0, void 0, function () {
            var currentHash, res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.error = undefined;
                        this.loading = true;
                        currentHash = Math.random().toString(36).substring(2);
                        this.loadingHash = currentHash;
                        this.triggerOnChangeIfNeeded();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, this.dataSource.list(this.name, this.fields, this.initialConfig.aggregations, this.filters, this.search, this.sorting, this.offset, this.limit, this.arguments)];
                    case 2:
                        res = _a.sent();
                        if (res && this.loadingHash == currentHash) {
                            this.count = res.count;
                            this.aggregations = res.aggregations;
                            this.setData(res.items || []);
                            this.initialized = true;
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        if (this.loadingHash == currentHash) {
                            this.error = err_1;
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        if (this.loadingHash == currentHash) {
                            this.loading = false;
                        }
                        this.triggerOnChangeIfNeeded();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        _this.reload = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.resetPolling();
                return [2 /*return*/, this.get()];
            });
        }); };
        _this.delete = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataSource.delete(this.name, id, ["id"])];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        }); };
        _this.getItem = function (props) {
            var item = new Resource({
                name: _this.name,
                id: props.id,
                initialArgs: props.args,
                dataSource: _this.dataSource,
                fields: _this.fields,
            });
            return item;
        };
        _this.setInitialValues = function (values) {
            _this.search = values.initialSearch;
            _this.sorting = values.initialSorting;
            _this.offset = values.initialOffset;
            _this.limit = values.initialLimit;
            _this.updateFilters(values.initialFilters, false, false);
            _this.triggerOnChangeIfNeeded();
        };
        _this.resetFilters = function () {
            _this.setInitialValues(_this.initialConfig);
            _this.triggerOnChangeIfNeeded();
        };
        _this.resetPagination = function () {
            _this.offset = 0;
            _this.triggerOnChangeIfNeeded();
        };
        _this.updateFilters = function (filters, autoreload, autopersist) {
            if (autoreload === void 0) { autoreload = true; }
            if (autopersist === void 0) { autopersist = true; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.updateNamedFilters("_default", filters, autoreload, autopersist)];
                });
            });
        };
        _this.updateNamedFilters = function (key, filters, autoreload, autopersist) {
            if (autoreload === void 0) { autoreload = true; }
            if (autopersist === void 0) { autopersist = true; }
            return __awaiter(_this, void 0, void 0, function () {
                var filtersBefore, filtersAfter, filtersChanged;
                return __generator(this, function (_a) {
                    filtersBefore = JSON.stringify(this.filters);
                    this.filters = this.filters || {};
                    if (filters) {
                        this.filters[key] = filters;
                    }
                    else {
                        delete this.filters[key];
                    }
                    filtersAfter = JSON.stringify(this.filters);
                    filtersChanged = filtersBefore !== filtersAfter;
                    this.hasFilterChanges = this.hasFilterChanges || filtersChanged;
                    if (filtersChanged)
                        this.resetPagination();
                    if (autopersist)
                        this.autopersistConfig();
                    this.triggerOnChangeIfNeeded();
                    if (autoreload)
                        return [2 /*return*/, this.reload()];
                    return [2 /*return*/];
                });
            });
        };
        _this.namedFilter = function (key) {
            return _this.filters && _this.filters[key];
        };
        _this.updateSearch = function (search, autoreload) {
            if (autoreload === void 0) { autoreload = true; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.search = search;
                    this.resetPagination();
                    this.autopersistConfig();
                    this.triggerOnChangeIfNeeded();
                    if (autoreload)
                        return [2 /*return*/, this.reload()];
                    return [2 /*return*/];
                });
            });
        };
        _this.updateSorting = function (sorting, autoreload) {
            if (autoreload === void 0) { autoreload = true; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.sorting = sorting;
                    this.autopersistConfig();
                    this.triggerOnChangeIfNeeded();
                    if (autoreload)
                        return [2 /*return*/, this.reload()];
                    return [2 /*return*/];
                });
            });
        };
        _this.updateOffset = function (offset, autoreload) {
            if (autoreload === void 0) { autoreload = true; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.offset = offset;
                    this.autopersistConfig();
                    this.triggerOnChangeIfNeeded();
                    if (autoreload)
                        return [2 /*return*/, this.reload()];
                    return [2 /*return*/];
                });
            });
        };
        _this.updateLimit = function (limit, autoreload) {
            if (autoreload === void 0) { autoreload = true; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.limit = limit;
                    this.autopersistConfig();
                    this.triggerOnChangeIfNeeded();
                    if (autoreload)
                        return [2 /*return*/, this.reload()];
                    return [2 /*return*/];
                });
            });
        };
        _this.initialConfig = config;
        if (config.autopersistConfigKey) {
            _this.autopersistConfigKey = config.autopersistConfigKey;
            var storage = sessionStorage || localStorage;
            var storedConfig = storage && storage.getItem(_this.autopersistConfigKey);
            if (storedConfig) {
                var c = JSON.parse(storedConfig);
                _this.search = c.search;
                _this.sorting = c.sorting;
                _this.offset = c.offset;
                _this.limit = c.limit;
                _this.filters = c.filters;
                return _this;
            }
        }
        _this.setInitialValues(config);
        return _this;
    }
    // item has to be loaded in current dataset
    ResourceCollection.prototype.patchItemValues = function (id, values) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var itemData, res, newData;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        itemData = (_a = this.data) === null || _a === void 0 ? void 0 : _a.find(function (x) { return x.id == id; });
                        if (typeof itemData === "undefined") {
                            throw new Error("item with id " + id + " not found in current collection dataset");
                        }
                        res = this.getItem({ id: id });
                        res.setData(itemData);
                        return [4 /*yield*/, res.patch(values)];
                    case 1:
                        _c.sent();
                        newData = (_b = this.data) === null || _b === void 0 ? void 0 : _b.map(function (x) {
                            return x.id == id && res.data ? res.data : x;
                        });
                        if (newData) {
                            this.setData(newData);
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    Object.defineProperty(ResourceCollection.prototype, "page", {
        get: function () {
            var limit = this.limit || 30;
            var offset = this.offset || 0;
            return Math.ceil(offset / limit);
        },
        enumerable: false,
        configurable: true
    });
    return ResourceCollection;
}(ResourceBase));
export { ResourceCollection };
//# sourceMappingURL=ResourceCollection.js.map