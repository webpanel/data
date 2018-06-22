// use local version until: https://github.com/codemeasandwich/graphql-query-builder/pull/9
// import Query from './graphql-query';

export type GraphQLArgumentType = GraphQLArgumentMap | string | number | null;
export interface GraphQLArgumentMap {
  [key: string]: GraphQLArgumentType | GraphQLArgumentType[];
}
function isGraphQLArgumentMap(arg: any): arg is GraphQLArgumentMap {
  return arg !== null && typeof arg === 'object';
}

export class GraphQLField {
  private name?: string;
  private _fields: GraphQLField[] = [];
  private _args: GraphQLArgumentMap = {};

  constructor(name: string) {
    this.name = name;
  }

  field(field: GraphQLField | string): GraphQLField {
    if (typeof field === 'string') {
      field = new GraphQLField(field);
    }
    this._fields.push(field);
    return this;
  }

  fields(fields: GraphQLField[] | string[]): GraphQLField {
    for (let field of fields) {
      this.field(field);
    }
    return this;
  }

  arg(key: string, value: GraphQLArgumentType): GraphQLField {
    this._args[key] = value;
    return this;
  }
  args(value: GraphQLArgumentMap): GraphQLField {
    this._args = value;
    return this;
  }

  toString(): string {
    let str = this.name;
    if (Object.keys(this._args).length > 0) {
      let serializedArgs = this.serializeArgs(this._args);
      if (serializedArgs) {
        str += '(' + serializedArgs.substr(1, serializedArgs.length - 2) + ')';
      }
    }
    if (this._fields.length > 0) {
      str += ' {' + this._fields.map(x => x.toString()).join(' ') + '}';
    }
    return str + ' ';
  }

  private serializeArgs(args: GraphQLArgumentMap): string | null {
    let res: string[] = [];
    for (let key of Object.keys(args)) {
      let value = args[key];
      let serialized = this.serializeArg(value);
      if (typeof serialized !== 'undefined') {
        res.push(`${key}:${serialized}`);
      }
    }
    if (res.length === 0) {
      return null;
    }
    return `{${res.join(',')}}`;
  }
  private serializeArg(
    value: GraphQLArgumentType | GraphQLArgumentType[]
  ): string | number | null | undefined {
    let res = undefined;
    if (Array.isArray(value)) {
      res = '[' + value.map((x: any) => this.serializeArg(x)).join(',') + ']';
    } else if (typeof value === 'string') {
      res = JSON.stringify(value);
    } else if (isGraphQLArgumentMap(value)) {
      res = this.serializeArgs(value);
    } else {
      res = value;
    }
    return res;
  }
}

export type GraphQLQueryType = 'query' | 'mutation';

export class GraphQLQuery extends GraphQLField {
  type: GraphQLQueryType;

  constructor(type: GraphQLQueryType, name: string) {
    super(name);
    this.type = type;
  }

  toString(): string {
    return this.type + ' ' + super.toString();
  }
}
