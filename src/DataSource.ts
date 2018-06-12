import * as inflection from 'inflection';
import { AuthSession } from 'webpanel-auth';

import { GraphQLConnector } from './utils/networking/GraphQLConnector';
import {
  GraphQLQuery,
  GraphQLField,
  GraphQLArgumentMap
} from './utils/networking/GraphQLQuery';
// import { AuthSession } from '../store/AuthSession';
import { isConnectorError } from './utils/networking/Connector';

export enum DataSourceOperation {
  list = 'list',
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete'
}

const connectors = {
  graphql: new GraphQLConnector()
};

export type GraphQLFieldSource = { [key: string]: any } | string;
export type GraphQLFieldSourceMap = GraphQLFieldSource | GraphQLFieldSource[];

export type DataSourceTypes = 'graphql';
export class DataSource {
  name: string;
  type: DataSourceTypes;
  url: string;

  constructor(name: string, type: DataSourceTypes, url: string) {
    this.name = name;
    this.type = type;
    this.url = url;
  }

  getConnector() {
    const conn = connectors[this.type];
    if (!conn) {
      throw new Error(`unknown data source type ${this.type}`);
    }
    return conn;
  }

  async list(
    name: string,
    fields: string[],
    args: { [key: string]: any }
  ): Promise<any> {
    return this.send(DataSourceOperation.list, name, fields, args);
  }
  async create(
    name: string,
    data: { [key: string]: string },
    fields: string[]
  ): Promise<any> {
    return this.send(DataSourceOperation.create, name, fields, { input: data });
  }
  async read(
    name: string,
    id: string | number | undefined,
    fields: string[],
    args?: { [key: string]: any }
  ): Promise<any> {
    args = args || {};
    let _args = { ...args };
    if (id) _args.id = id;
    return this.send(DataSourceOperation.read, name, fields, _args);
  }
  async update(
    name: string,
    id: string | number,
    data: { [key: string]: string },
    fields: string[]
  ): Promise<any> {
    return this.send(DataSourceOperation.update, name, fields, {
      id,
      input: data
    });
  }
  async delete(
    name: string,
    id: string | number,
    fields: string[]
  ): Promise<any> {
    return this.send(DataSourceOperation.delete, name, fields, { id });
  }

  fillFieldsFromObject(field: GraphQLField, obj: GraphQLFieldSourceMap) {
    if (Array.isArray(obj)) {
      for (let f of obj) {
        this.fillFieldsFromObject(field, f);
      }
    } else if (typeof obj === 'object') {
      for (let key of Object.keys(obj)) {
        const f = new GraphQLField(key);
        field.field(f);
        this.fillFieldsFromObject(f, obj[key]);
      }
    } else if (typeof obj === 'string') {
      field.field(new GraphQLField(obj));
    }
  }

  fieldForOperation(
    operation: DataSourceOperation,
    fetchFieldName: string,
    fields: GraphQLFieldSourceMap,
    args: GraphQLArgumentMap = {}
  ): GraphQLField {
    let field = new GraphQLField(fetchFieldName);

    if (operation === 'list') {
      const entityItemsField = new GraphQLField('items');
      field.field(entityItemsField);
      field.field('count');
      if (args) {
        field.args(args);
      }
      this.fillFieldsFromObject(entityItemsField, fields);
    } else {
      this.fillFieldsFromObject(field, fields);
      if (args) {
        field.args(args);
      }
    }

    return field;
  }

  async send(
    operation: DataSourceOperation,
    name: string,
    fields: string[],
    args: GraphQLArgumentMap = {}
  ): Promise<any> {
    let fetchFieldName = inflection.camelize(inflection.pluralize(name), true);

    switch (operation) {
      case 'read':
        fetchFieldName = inflection.camelize(
          inflection.singularize(name),
          true
        );
        break;
      case 'create':
        fetchFieldName = `create${name}`;
        break;
      case 'update':
        fetchFieldName = `update${name}`;
        break;
      case 'delete':
        fetchFieldName = `delete${name}`;
        break;
      default:
    }
    // console.log('???', operation, fetchFieldName, args);

    const query = new GraphQLQuery(
      operation === 'read' || operation === 'list' ? 'query' : 'mutation',
      'operation'
    );

    const field = this.fieldForOperation(
      operation,
      fetchFieldName,
      fields,
      args
    );
    query.field(field);

    try {
      let res = await this.getConnector().send(this.url, query);
      return res.data && res.data[fetchFieldName];
    } catch (err) {
      if (isConnectorError(err)) {
        if (err.authorization) {
          AuthSession.current().logout();
          return;
        }
      }

      throw err;
    }
  }
}

// export class DataSourceProvider {
//   static _shared: DataSourceProvider;

//   datasources: { [key: string]: DataSource } = {};

//   static shared() {
//     if (typeof this._shared === 'undefined') {
//       this._shared = new DataSourceProvider();
//     }
//     return this._shared;
//   }

//   constructor() {
//     // const rootConfig = ConfigProvider.getConfig('root');
//     // const dataSourcesConfig = rootConfig.datasources as { [key: string]: any };
//     // for (let name of Object.keys(dataSourcesConfig)) {
//     //   const conf = dataSourcesConfig[name];
//     //   this.datasources[name] = new DataSource(name, conf.type, conf.url);
//     // }
//   }

//   getDataSource(name: string): DataSource {
//     const ds = this.datasources[name];
//     if (typeof ds === 'undefined') {
//       throw new Error(`datasource ${name} not found`);
//     }
//     return ds;
//   }
// }
