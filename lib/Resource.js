var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
import { observable } from 'mobx';
var Resource = /** @class */ (function () {
    function Resource(config) {
        var _this = this;
        this.loading = false;
        this.data = null;
        this.getIfHasID = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // console.log('get???', this.id);
                if (this.id) {
                    return [2 /*return*/, this.get()];
                }
                return [2 /*return*/];
            });
        }); };
        this.get = function () { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.id) {
                            throw new Error('resource id is missing');
                        }
                        this.loading = true;
                        return [4 /*yield*/, this.dataSource.read(this.name, this.id, this.fields, this.args || {})];
                    case 1:
                        res = _a.sent();
                        this.data = res;
                        this.loading = false;
                        return [2 /*return*/];
                }
            });
        }); };
        this.create = function (values) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.loading = true;
                        return [4 /*yield*/, this.dataSource.create(this.name, values, [
                                'id'
                            ].concat(this.fields))];
                    case 1:
                        res = _a.sent();
                        // console.log('created???', res);
                        this.data = res;
                        this.id = res.id;
                        this.loading = false;
                        return [2 /*return*/];
                }
            });
        }); };
        this.update = function (values) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.id) {
                            throw new Error('resource id is missing');
                        }
                        this.loading = true;
                        return [4 /*yield*/, this.dataSource.update(this.name, this.id, values, this.fields)];
                    case 1:
                        res = _a.sent();
                        this.data = res;
                        this.loading = false;
                        return [2 /*return*/];
                }
            });
        }); };
        this.delete = function () { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.id) {
                            throw new Error('resource id is missing');
                        }
                        this.loading = true;
                        return [4 /*yield*/, this.dataSource.delete(this.name, this.id, this.fields)];
                    case 1:
                        res = _a.sent();
                        this.data = res;
                        this.loading = false;
                        return [2 /*return*/];
                }
            });
        }); };
        this.isPersisted = function () {
            return !!_this.id;
        };
        this.save = function (values) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.id) {
                    return [2 /*return*/, this.create(values)];
                }
                return [2 /*return*/, this.update(values)];
            });
        }); };
        this.id = config.id;
        this.dataSource = config.dataSource;
        // this.dataSource = DataSourceProvider.shared().getDataSource(
        //   config.dataSource
        // );
        this.name = config.name;
        this.fields = config.fields;
        if (!this.id) {
            this.data = config.defaultValues;
        }
    }
    __decorate([
        observable
    ], Resource.prototype, "loading", void 0);
    __decorate([
        observable
    ], Resource.prototype, "data", void 0);
    return Resource;
}());
export { Resource };
//# sourceMappingURL=Resource.js.map