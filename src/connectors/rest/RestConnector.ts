import * as inflection from 'inflection';
import * as url from 'url';

import { HTTPRequest, HTTPResponse, ConnectorError } from '../Connector';
import { HTTPConnector } from '../HTTPConnector';
import {
  DataSourceRequest,
  DataSourceOperation
} from '../../DataSourceRequest';

export class RestConnectorError extends ConnectorError {
  status: number;
  response: HTTPResponse;

  constructor(response: HTTPResponse, message?: string | undefined) {
    super(response.status === 401, [new Error(message)]);
    this.response = response;
  }
}

export class RestConnector extends HTTPConnector {
  protected async sendHttpRequest(request: HTTPRequest): Promise<HTTPResponse> {
    let res = await super.sendHttpRequest(request);

    if (res.status < 200 || res.status >= 300) {
      throw new RestConnectorError(res, this.getErrorMessageFromResponse(res));
    }

    return res;
  }

  transformRequest(request: DataSourceRequest): HTTPRequest {
    let entityName = inflection.camelize(
      inflection.pluralize(request.name),
      true
    );

    let fetchUrl = url.resolve(request.url, entityName) + '/';
    if (request.id) {
      fetchUrl = url.resolve(fetchUrl, request.id.toString());
    }

    let querystring = {};
    if (request.arguments) {
      for (let key in request.arguments) {
        querystring[key] = request.arguments[key];
      }
    }

    if (request.limit) {
      querystring['limit'] = request.limit;
    }
    if (request.offset) {
      querystring['offset'] = request.offset;
    }

    return new HTTPRequest({
      url: fetchUrl,
      querystring,
      method: this.methodForOperation(request.operation),
      data: JSON.stringify(request.data)
    });
  }

  methodForOperation(operation: DataSourceOperation): string {
    switch (operation) {
      case 'list':
      case 'read':
        return 'GET';
      case 'create':
        return 'POST';
      case 'update':
        return 'PATCH';
      case 'delete':
        return 'DELETE';
    }
    return 'GET';
  }
}
