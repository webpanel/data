import { cloneDeep } from 'lodash';
import { stringify, parse } from 'querystring';
var HTTPRequest = /** @class */ (function () {
    function HTTPRequest(variables) {
        if (variables === void 0) { variables = {}; }
        this.querystring = {};
        this.headers = {};
        var cloned = cloneDeep(variables);
        if (!cloned.url) {
            throw new Error("cannot create new request without url");
        }
        var _a = cloned.url.split('?'), url = _a[0], qs = _a[1];
        this.url = url;
        this.querystring = Object.assign({}, parse(qs), variables.querystring);
        this.method = cloned.method;
        this.data = cloned.data;
        this.headers = cloned.headers || {};
    }
    HTTPRequest.prototype.getUrl = function () {
        var qs = stringify(this.querystring);
        return qs.length > 0 ? this.url + "?" + qs : this.url;
    };
    HTTPRequest.prototype.addParam = function (key, value) {
        this.querystring[key] = value;
    };
    return HTTPRequest;
}());
export { HTTPRequest };
//# sourceMappingURL=HTTPRequest.js.map