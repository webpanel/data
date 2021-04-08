// use local version until: https://github.com/codemeasandwich/graphql-query-builder/pull/9
// import Query from './graphql-query';

import { SortInfo, SortInfoOrder } from "../../DataSourceRequest";

export type GraphQLArgumentType =
  | GraphQLArgumentMap
  | SortInfo
  | string
  | number
  | null
  | undefined;

export type SortInfoValue =
  | string
  | {
      [key: string]: any;
    };
export interface GraphQLArgumentMap {
  [key: string]: GraphQLArgumentType | GraphQLArgumentType[];
}

function isGraphQLArgumentMap(arg: any): arg is GraphQLArgumentMap {
  return arg !== null && typeof arg === "object";
}

export interface GraphQLFieldOptions {
  sortingFormatter: (sorting: SortInfo[]) => SortInfoValue[];
}

export class GraphQLField {
  private name?: string;
  protected options: GraphQLFieldOptions;
  private _fields: GraphQLField[] = [];
  private _args: GraphQLArgumentMap = {};

  constructor(name: string, options?: GraphQLFieldOptions) {
    this.name = name;
    this.options = options || {
      sortingFormatter: this.formatSortInfo,
    };
  }

  addField(field: GraphQLField | string): GraphQLField {
    if (typeof field === "string") {
      field = new GraphQLField(field);
    }
    this._fields.push(field);
    return this;
  }

  fields(fields: GraphQLField[] | string[]): GraphQLField {
    for (let field of fields) {
      this.addField(field);
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
        str += "(" + serializedArgs.substr(1, serializedArgs.length - 2) + ")";
      }
    }
    if (this._fields.length > 0) {
      str += " {" + this._fields.map((x) => x.toString()).join(" ") + "}";
    }
    return str + " ";
  }

  formatSortInfo(sorting: SortInfo[]): SortInfoValue[] {
    return (
      sorting &&
      sorting.map(
        (sort: any) =>
          sort.columnKey.toUpperCase() +
          (sort.order === SortInfoOrder.descend ? "_DESC" : "_ASC")
      )
    );
  }

  private serializeArgs(args: GraphQLArgumentMap): string | null {
    let res: string[] = [];
    for (let key of Object.keys(args)) {
      let value = args[key];
      let serialized = this.serializeArg(value);
      if (value !== null && !value) {
        continue;
      }
      if (typeof serialized !== "undefined") {
        if (key === "filter" || key === "sort" || key === "input") {
          res.push(`${key}:$${key}`);
        } else {
          res.push(`${key}:${serialized}`);
        }
      }
    }
    if (res.length === 0) {
      return null;
    }
    return `{${res.join(",")}}`;
  }
  private serializeArg(
    value: GraphQLArgumentType | GraphQLArgumentType[]
  ): SortInfo | string | number | null | undefined {
    let res = undefined;
    if (Array.isArray(value)) {
      res = "[" + value.map((x: any) => this.serializeArg(x)).join(",") + "]";
    } else if (typeof value === "string") {
      res = JSON.stringify(value);
    } else if (isGraphQLArgumentMap(value)) {
      res = this.serializeArgs(value);
    } else {
      res = value;
    }
    return res;
  }

  get arguments(): object {
    return Object.assign(
      {},
      this._args,
      ...this._fields.map((field) => field.arguments)
    );
  }
}

export type GraphQLQueryType = "query" | "mutation";

export class GraphQLQuery extends GraphQLField {
  type: GraphQLQueryType;

  constructor(
    type: GraphQLQueryType,
    name: string,
    options?: GraphQLFieldOptions
  ) {
    super(name, options);
    this.type = type;
  }

  toString(): string {
    return JSON.stringify({
      query: this.type + " " + super.toString(),
      variables: this.variables,
    });
  }

  get variables() {
    const args = this.arguments;
    const processedArgs = {};
    for (const key in args) {
      if (key === "sort" || key === "filter" || key === "input") {
        const val = args[key];
        processedArgs[`${key}`] =
          key === "sort"
            ? this.options.sortingFormatter(<SortInfo[]>(val || []))
            : val;
      }
    }
    return processedArgs;
  }
}
