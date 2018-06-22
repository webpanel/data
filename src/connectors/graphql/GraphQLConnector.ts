import * as inflection from 'inflection';

import {
  HTTPRequest,
  HTTPResponse,
  ConnectorError,
  DataSourceRequest,
  DataSourceOperation
} from '../../connectors/Connector';
import { GraphQLQuery, GraphQLField, GraphQLArgumentMap } from './GraphQLQuery';
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
    let fetchFieldName = inflection.camelize(
      inflection.pluralize(request.name),
      true
    );

    switch (request.operation) {
      case 'read':
        fetchFieldName = inflection.camelize(
          inflection.singularize(request.name),
          true
        );
        break;
      case 'create':
        fetchFieldName = `create${request.name}`;
        break;
      case 'update':
        fetchFieldName = `update${request.name}`;
        break;
      case 'delete':
        fetchFieldName = `delete${request.name}`;
        break;
      default:
    }

    const query = new GraphQLQuery(
      request.operation === 'read' || request.operation === 'list'
        ? 'query'
        : 'mutation',
      'operation'
    );

    const field = this.fieldForOperation(
      request.operation,
      fetchFieldName,
      request.fields
      // {
      //   filter: request.filters
      // }
    );
    query.field(field);

    return new HTTPRequest({
      url: request.url,
      method: 'POST',
      data: JSON.stringify({ query: query.toString() })
    });
  }

  transformData(res: HTTPResponse, request: DataSourceRequest): any {
    const keys = Object.keys(res.data.data);
    return res.data.data[keys[0]];
  }

  private fillFieldsFromObject(
    field: GraphQLField,
    obj: GraphQLFieldSourceMap
  ) {
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

  private fieldForOperation(
    operation: DataSourceOperation,
    fetchFieldName: string,
    fields: GraphQLFieldSourceMap,
    args: GraphQLArgumentMap = {}
  ): GraphQLField {
    console.log(fetchFieldName);
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
