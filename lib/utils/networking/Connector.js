// import { Response } from 'node-fetch';
// import { Request } from '../Request';
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
export { Request } from '../Request';
export { Response } from 'node-fetch';
var ConnectorError = /** @class */ (function (_super) {
    __extends(ConnectorError, _super);
    function ConnectorError(authorization, errors) {
        var _this = _super.call(this, errors.map(function (x) { return x.message; }).join(', ')) || this;
        _this.connectorError = true;
        _this.authorization = authorization;
        _this.errors = errors;
        return _this;
    }
    return ConnectorError;
}(Error));
export { ConnectorError };
export function isConnectorError(arg) {
    return arg.connectorError === true;
}
//# sourceMappingURL=Connector.js.map