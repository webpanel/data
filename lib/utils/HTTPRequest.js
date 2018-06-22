import { cloneDeep } from 'lodash';
var HTTPRequest = /** @class */ (function () {
    function HTTPRequest(variables) {
        if (variables === void 0) { variables = {}; }
        this.headers = {};
        var cloned = cloneDeep(variables);
        this.url = cloned.url || null;
        this.data = cloned.data || {};
        this.headers = cloned.headers || {};
    }
    return HTTPRequest;
}());
export { HTTPRequest };
//# sourceMappingURL=HTTPRequest.js.map