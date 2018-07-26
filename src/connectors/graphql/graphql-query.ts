'use strict';

// =====================================================
// ============================ parce properties to find
// =====================================================

function parseFind(_levelA: (string | object)[]): string {
  // +++++++++++++++++++++++++++++++++++ work over Array
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++

  return _levelA.map((currentValue: string | object) => {
    if (currentValue instanceof Query) {
      return currentValue.toString();
    } else if (!Array.isArray(currentValue) && 'object' === typeof currentValue) {
      const propsA = Object.keys(currentValue);
      if (1 !== propsA.length) {
        throw new RangeError(
          'Alias objects should only have one value. was passed: ' +
          JSON.stringify(currentValue)
        );
      }
      const propS = propsA[0];
      const item = currentValue[propS];
      // tslint:disable-next-line
      // contributor: https://github.com/charlierudolph/graphql-query-builder/commit/878328e857e92d140f5ba6f7cfe07837620ec490
      if (Array.isArray(item)) {
        return new Query(propS).find(item);
      }
      return `${propS} : ${item} `;
    } else if ('string' === typeof currentValue) {
      return currentValue;
    } else {
      throw new RangeError('cannot handle Find value of ' + currentValue);
    }
  }).join(',');
}

// =====================================================
// =================================== get GraphQL Value
// =====================================================

function getGraphQLValue(value: string | object): string | object | undefined {
  if (value === null) {
    return value;
  } else if ('string' === typeof value) {
    value = JSON.stringify(value);
  } else if (Array.isArray(value)) {
    value = value
      .map(item => {
        return getGraphQLValue(item);
      })
      .join();
    value = `[${value}]`;
  } else if ('object' === typeof value) {
    /*if (value.toSource)
            value = value.toSource().slice(2,-2);
        else*/
    value = objectToString(value);
    if (value === '{}') { return undefined; }
    // console.error('No toSource!!',value);
  }
  return value;
}

function objectToString(obj: object) {
  return (<any> Object)
    .entries(obj)
    .map((entry: object[]) => {
      const [key, value] = entry;

      if ('function' === typeof value) { return false; }

      const graphQLValue = getGraphQLValue(value);
      if (typeof graphQLValue !== 'undefined') { return `${key}:${value}`; }
      return false;
    })
    .join();
}

// =====================================================
// ========================================= Query Class
// =====================================================
class Query {
  fnNameS: string;
  headA: any[];
  aliasS: string;
  bodyS: string;

  constructor(_fnNameS: string, aliasOrFilter?: string | object | undefined) {
    this.fnNameS = _fnNameS;

    if ('string' === typeof aliasOrFilter) {
      this.aliasS = aliasOrFilter;
    } else if ('object' === typeof aliasOrFilter) {
      this.filter(aliasOrFilter);
    } else if (undefined === aliasOrFilter && 2 === arguments.length) {
      throw new TypeError(
        'You have passed undefined as Second argument to \'Query\''
      );
    } else if (undefined !== aliasOrFilter) {
      throw new TypeError(
        'Second argument to \'Query\' should be an alias name(String) or filter arguments(Object). was passed ' +
        aliasOrFilter
      );
    }
  }

  filter = (filtersO: object) => {
    const filteredValues = (<any> Object)
      .values(filtersO)
      .map((value: any, propS: number) => {
        if ('function' === typeof value) { return false; }

        const graphQLValue = getGraphQLValue(value);
        if ('{}' === graphQLValue) { return false; }

        if ('undefined' !== typeof graphQLValue) { return `${propS}:${graphQLValue}`; }
        return false;
      })
      .filter((value: any) => !!value);

    this.headA.push(...filteredValues);
    return this;
  };

  setAlias = (_aliasS: string) => {
    this.aliasS = _aliasS;
    return this;
  };

  find(findA: (string | object)[] | object) {
    // THIS NEED TO BE A 'FUNCTION' to scope 'arguments'
    if (!findA) {
      throw new TypeError('find value can not be >>falsy<<');
    }

    // if its a string.. it may have other values
    // else it should be an Object or Array of mapped values
    this.bodyS = parseFind(
      Array.isArray(findA) ? findA : Array.from(arguments)
    );
    return this;
  };

  toString = () => {
    if (undefined === this.bodyS) {
      throw new ReferenceError(
        'return properties are not defined. use the \'find\' function to defined them'
      );
    }

    return `${this.aliasS ? this.aliasS + ':' : ''} ${this.fnNameS} ${
      0 < this.headA.length ? '(' + this.headA.join(',') + ')' : ''
      }  { ${this.bodyS} }`;
  }
}

module.exports = Query;
