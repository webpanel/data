import * as inflection from 'inflection';

import {
  ConnectorError,
  DataSourceOperation,
  DataSourceRequest,
  HTTPRequest,
  HTTPResponse,
  ResourceCollectionResponse,
  ResourceResponse
} from '../../connectors/Connector';
import { GraphQLArgumentMap, GraphQLField, GraphQLQuery } from './GraphQLQuery';

import { HTTPConnector } from '../HTTPConnector';

export type GraphQLFieldSource = { [key: string]: any } | string;
export type GraphQLFieldSourceMap = GraphQLFieldSource | GraphQLFieldSource[];

export class GraphQLConnector extends HTTPConnector {
  protected async sendHttpRequest(request: HTTPRequest): Promise<HTTPResponse> {
    let res = await super.sendHttpRequest(request);

    if (res.status == 401) {
      throw new ConnectorError(true, [
        new Error(this.getErrorMessageFromResponse(res))
      ]);
    }

    return res;
  }

  async transformResponse(
    response: HTTPResponse,
    request: DataSourceRequest
  ): Promise<ResourceResponse | ResourceCollectionResponse | null> {
    if (response.data && response.data.errors) {
      let authorization = false;
      const errors = response.data.errors.map((e: any) => {
        if (
          e.message === 'jwt must be provided' ||
          e.message === 'jwt malformed' ||
          e.code === 'UNAUTHORIZED' ||
          e.authorization
        ) {
          authorization = true;
        }
        return new Error(e.message);
      });
      throw new ConnectorError(authorization, errors);
    }

    let fetchFieldName = this.fetchFieldNameForRequest(request);

    const data =
      response.data && response.data.data && response.data.data[fetchFieldName];
    if (null === data) {
      return data;
    }

    return this.responseTransformer.handle(request.operation, data);
  }

  fetchFieldNameForRequest(request: DataSourceRequest): string {
    let fetchFieldName = inflection.camelize(
      inflection.pluralize(request.name),
      true
    );
    const entityName = inflection.camelize(
      inflection.singularize(request.name),
      false
    );

    switch (request.operation) {
      case DataSourceOperation.read:
        fetchFieldName = inflection.camelize(
          inflection.singularize(request.name),
          true
        );
        break;
      case DataSourceOperation.create:
        fetchFieldName = `create${entityName}`;
        break;
      case DataSourceOperation.update:
        fetchFieldName = `update${entityName}`;
        break;
      case DataSourceOperation.delete:
        fetchFieldName = `delete${entityName}`;
        break;
      default:
    }
    return fetchFieldName;
  }

  transformRequest(request: DataSourceRequest): HTTPRequest {
    let fetchFieldName = this.fetchFieldNameForRequest(request);

    let filter: { [key: string]: any } = {};
    for (const filterName of Object.keys(request.filters)) {
      for (const key of Object.keys(request.filters[filterName])) {
        filter[key] = request.filters[filterName][key];
      }
    }

    const args =
      request.operation === DataSourceOperation.list
        ? {
            filter,
            q: request.search,
            offset: request.offset,
            limit: request.limit,
            sort: request.sorting
          }
        : { id: request.id, input: request.data };

    const query = new GraphQLQuery(
      request.operation === 'read' || request.operation === 'list'
        ? 'query'
        : 'mutation',
      this.generateQueryParams(request, args)
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

  generateQueryParams(request: DataSourceRequest, args: object) {
    let fieldName = this.fetchFieldNameForRequest(request);
    let str = fieldName;
    let header = (<any>Object)
      .keys(args)
      .map((key: string) => {
        switch (key) {
          case 'filter':
            if (!args[key]) return '';
            return `$${key}: ${inflection.singularize(
              inflection.camelize(fieldName, false)
            )}FilterType`;

          case 'sort':
            if (!args[key]) return '';
            return `$${key}: [${inflection.singularize(
              inflection.camelize(fieldName, false)
            )}SortType!]`;

          case 'input':
            if (!args[key]) return '';
            return `$${key}: ${inflection.singularize(
              inflection.camelize(request.name, false)
            )}Raw${inflection.camelize(request.operation)}Input!`;

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
    if (!res.data) {
      return null;
    }
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
