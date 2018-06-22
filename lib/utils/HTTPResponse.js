var HTTPResponse = /** @class */ (function () {
    function HTTPResponse(data) {
        this.data = data;
    }
    HTTPResponse.prototype.getData = function () {
        return this.dataGetter ? this.dataGetter(this) : this.data;
    };
    return HTTPResponse;
}());
export { HTTPResponse };
//# sourceMappingURL=HTTPResponse.js.map