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
import { AuthSession } from 'webpanel-auth';
import fetch from 'node-fetch';
import { HTTPResponse } from './Connector';
import { ResponseDataTransformer } from './ResponseDataTransformer';
var HTTPConnector = /** @class */ (function () {
    function HTTPConnector(config) {
        if (config === void 0) { config = {}; }
        this.responseTransformer =
            config.responseDataTransformer || new ResponseDataTransformer();
    }
    HTTPConnector.prototype.sendHttpRequest = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, res, json, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        accessToken = AuthSession.current().accessToken;
                        return [4 /*yield*/, fetch(request.getUrl(), {
                                method: request.method,
                                body: request.data,
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: "Bearer " + accessToken
                                }
                            })];
                    case 1:
                        res = _b.sent();
                        if (!(res.status !== 204)) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.json()];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = null;
                        _b.label = 4;
                    case 4:
                        json = _a;
                        return [2 /*return*/, new HTTPResponse(json, res.status)];
                }
            });
        });
    };
    HTTPConnector.prototype.getErrorMessageFromResponse = function (res) {
        return res.data.error_description || res.data.error || res.data.message;
    };
    HTTPConnector.prototype.transformRequest = function (request) {
        throw new Error('build request must be implemented');
    };
    HTTPConnector.prototype.transformResponse = function (response, request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.responseTransformer.handle(request.operation, response)];
            });
        });
    };
    HTTPConnector.prototype.send = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = this.transformRequest(request);
                        return [4 /*yield*/, this.sendHttpRequest(req)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, this.transformResponse(res.data, request)];
                }
            });
        });
    };
    return HTTPConnector;
}());
export { HTTPConnector };
//# sourceMappingURL=HTTPConnector.js.map