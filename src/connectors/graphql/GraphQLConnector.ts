import * as inflection from 'inflection';
// import fetch from 'node-fetch';
// import { AuthSession } from 'webpanel-auth';

import {
  HTTPRequest,
  HTTPResponse,
  ConnectorError,
  DataSourceRequest,
  DataSourceOperation
} from '../../connectors/Connector';
import { GraphQLQuery, GraphQLField, GraphQLArgumentMap } from './GraphQLQuery';
// import { GraphQLResponse } from './GraphQLResponse';
import { HTTPConnector } from '../HTTPConnector';

export type GraphQLFieldSource = { [key: string]: any } | string;
export type GraphQLFieldSourceMap = GraphQLFieldSource | GraphQLFieldSource[];

export class GraphQLConnector extends HTTPConnector {
  async send(req: HTTPRequest): Promise<HTTPResponse> {
    let res = await super.send(req);

    if (res.data.errors) {
      let authorization = false;
      const errors = res.data.errors.map((e: Error) => {
        if (
          e.message === 'jwt must be provided' ||
          e.message === 'jwt malformed'
        ) {
          authorization = true;
        }
        return new Error(e.message);
      });
      throw new ConnectorError(authorization, errors);
    }

    // return res.data && res.data[fetchFieldName];
    return new HTTPResponse(res.data);
  }

  transformRequest(request: DataSourceRequest): HTTPRequest {
    let fetchFieldName = inflection.camelize(inflection.pluralize(name), true);

    switch (request.operation) {
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
      request.operation === 'read' || request.operation === 'list'
        ? 'query'
        : 'mutation',
      'operation'
    );

    const field = this.fieldForOperation(
      request.operation,
      fetchFieldName,
      request.fields,
      {
        filter: request.filters
      }
    );
    query.field(field);
    return new HTTPRequest({
      url: request.url,
      data: JSON.stringify({ query: query.toString() })
    });
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
}
