'use strict';
// =====================================================
// ============================ parce properties to find
// =====================================================
function parseFind(_levelA) {
    // +++++++++++++++++++++++++++++++++++ work over Array
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++
    return _levelA.map(function (currentValue) {
        if (currentValue instanceof Query) {
            return currentValue.toString();
        }
        else if (!Array.isArray(currentValue) && 'object' === typeof currentValue) {
            var propsA = Object.keys(currentValue);
            if (1 !== propsA.length) {
                throw new RangeError('Alias objects should only have one value. was passed: ' +
                    JSON.stringify(currentValue));
            }
            var propS = propsA[0];
            var item = currentValue[propS];
            // tslint:disable-next-line
            // contributor: https://github.com/charlierudolph/graphql-query-builder/commit/878328e857e92d140f5ba6f7cfe07837620ec490
            if (Array.isArray(item)) {
                return new Query(propS).find(item);
            }
            return propS + " : " + item + " ";
        }
        else if ('string' === typeof currentValue) {
            return currentValue;
        }
        else {
            throw new RangeError('cannot handle Find value of ' + currentValue);
        }
    }).join(',');
}
// =====================================================
// =================================== get GraphQL Value
// =====================================================
function getGraphQLValue(value) {
    if (value === null) {
        return value;
    }
    else if ('string' === typeof value) {
        value = JSON.stringify(value);
    }
    else if (Array.isArray(value)) {
        value = value
            .map(function (item) {
            return getGraphQLValue(item);
        })
            .join();
        value = "[" + value + "]";
    }
    else if ('object' === typeof value) {
        /*if (value.toSource)
                value = value.toSource().slice(2,-2);
            else*/
        value = objectToString(value);
        if (value === '{}') {
            return undefined;
        }
        // console.error('No toSource!!',value);
    }
    return value;
}
function objectToString(obj) {
    return Object
        .entries(obj)
        .map(function (entry) {
        var key = entry[0], value = entry[1];
        if ('function' === typeof value) {
            return false;
        }
        var graphQLValue = getGraphQLValue(value);
        if (typeof graphQLValue !== 'undefined') {
            return key + ":" + value;
        }
        return false;
    })
        .join();
}
// =====================================================
// ========================================= Query Class
// =====================================================
var Query = /** @class */ (function () {
    function Query(_fnNameS, aliasOrFilter) {
        var _this = this;
        this.filter = function (filtersO) {
            var _a;
            var filteredValues = Object
                .values(filtersO)
                .map(function (value, propS) {
                if ('function' === typeof value) {
                    return false;
                }
                var graphQLValue = getGraphQLValue(value);
                if ('{}' === graphQLValue) {
                    return false;
                }
                if ('undefined' !== typeof graphQLValue) {
                    return propS + ":" + graphQLValue;
                }
                return false;
            })
                .filter(function (value) { return !!value; });
            (_a = _this.headA).push.apply(_a, filteredValues);
            return _this;
        };
        this.setAlias = function (_aliasS) {
            _this.aliasS = _aliasS;
            return _this;
        };
        this.toString = function () {
            if (undefined === _this.bodyS) {
                throw new ReferenceError('return properties are not defined. use the \'find\' function to defined them');
            }
            return (_this.aliasS ? _this.aliasS + ':' : '') + " " + _this.fnNameS + " " + (0 < _this.headA.length ? '(' + _this.headA.join(',') + ')' : '') + "  { " + _this.bodyS + " }";
        };
        this.fnNameS = _fnNameS;
        if ('string' === typeof aliasOrFilter) {
            this.aliasS = aliasOrFilter;
        }
        else if ('object' === typeof aliasOrFilter) {
            this.filter(aliasOrFilter);
        }
        else if (undefined === aliasOrFilter && 2 === arguments.length) {
            throw new TypeError('You have passed undefined as Second argument to \'Query\'');
        }
        else if (undefined !== aliasOrFilter) {
            throw new TypeError('Second argument to \'Query\' should be an alias name(String) or filter arguments(Object). was passed ' +
                aliasOrFilter);
        }
    }
    Query.prototype.find = function (findA) {
        // THIS NEED TO BE A 'FUNCTION' to scope 'arguments'
        if (!findA) {
            throw new TypeError('find value can not be >>falsy<<');
        }
        // if its a string.. it may have other values
        // else it should be an Object or Array of mapped values
        this.bodyS = parseFind(Array.isArray(findA) ? findA : Array.from(arguments));
        return this;
    };
    ;
    return Query;
}());
module.exports = Query;
//# sourceMappingURL=graphql-query.js.map