import * as inflection from 'inflection';

import {
  HTTPRequest,
  HTTPResponse,
  ConnectorError,
  DataSourceRequest,
  DataSourceOperation,
  ResourceResponse,
  ResourceCollectionResponse
} from '../../connectors/Connector';
import { GraphQLQuery, GraphQLField, GraphQLArgumentMap } from './GraphQLQuery';
import { HTTPConnector } from '../HTTPConnector';

export type GraphQLFieldSource = { [key: string]: any } | string;
export type GraphQLFieldSourceMap = GraphQLFieldSource | GraphQLFieldSource[];

export class GraphQLConnector extends HTTPConnector {
  async transformResponse(
    response: HTTPResponse,
    request: DataSourceRequest
  ): Promise<ResourceResponse | ResourceCollectionResponse | null> {
    if (response.status === 401) {
      throw new ConnectorError(true, [
        new Error(this.getErrorMessageFromResponse(response))
      ]);
    }

    if (response.data && response.data.errors) {
      let authorization = false;
      const errors = response.data.errors.map((e: Error) => {
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

    let fetchFieldName = inflection.camelize(
      inflection.pluralize(request.name),
      true
    );

    const data = response.data && response.data[fetchFieldName].items;
    if (false === data) {
      return data;
    }

    return this.responseTransformer.handle(request.operation, data);
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

    const args = {
      filter: request.filters,
      offset: request.offset,
      limit: request.limit,
      sort: request.sorting
    };

    const query = new GraphQLQuery(
      request.operation === 'read' || request.operation === 'list'
        ? 'query'
        : 'mutation',
      this.generateQueryParams(fetchFieldName, args)
    );

    const field = this.fieldForOperation(
      request.operation,
      fetchFieldName,
      request.fields,
      args
    );

    query.field(field);

    return new HTTPRequest({
      url: request.url,
      method: 'POST',
      data: query.toString()
    });
  }

  generateQueryParams(name: string, args: object) {
    let str = 'operation';
    let header = (<any>Object)
      .keys(args)
      .map((key: string) => {
        switch (key) {
          case 'filter':
            return `$${key}: ${inflection.singularize(
              inflection.camelize(name, false)
            )}FilterType`;

          case 'sort':
            return `$${key}: [${inflection.singularize(
              inflection.camelize(name, false)
            )}SortType!]`;

          default:
            return '';
        }
      })
      .filter((x: string) => !!x)
      .join(',');
    if (header) {
      header = `(${header})`;
    }
    return str + header;
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
