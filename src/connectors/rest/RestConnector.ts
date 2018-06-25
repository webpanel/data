import * as inflection from 'inflection';
import * as url from 'url';

import { HTTPRequest, HTTPResponse, ConnectorError } from '../Connector';
import { HTTPConnector } from '../HTTPConnector';
import {
  DataSourceRequest,
  DataSourceOperation
} from '../../DataSourceRequest';

export class RestConnectorError extends Error {
  status: number;
  response: HTTPResponse;

  constructor(
    status: number,
    response: HTTPResponse,
    message?: string | undefined
  ) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

export class RestConnector extends HTTPConnector {
  protected async sendHttpRequest(request: HTTPRequest): Promise<HTTPResponse> {
    let res = await super.sendHttpRequest(request);

    if (res.status < 200 || res.status >= 300) {
      throw new RestConnectorError(
        res.status,
        res,
        res.data.error_description || res.data.error
      );
    }

    if (res.status === 401) {
      throw new ConnectorError(true, [res.data]);
    }

    return res;
  }

  transformRequest(request: DataSourceRequest): HTTPRequest {
    console.log(request);
    let entityName = inflection.camelize(
      inflection.pluralize(request.name),
      true
    );

    let fetchUrl = url.resolve(request.url, entityName);
    if (request.id) {
      fetchUrl = url.resolve(fetchUrl, request.id.toString());
    }

    return new HTTPRequest({
      url: fetchUrl,
      method: this.methodForOperation(request.operation),
      data: JSON.stringify(request.data)
    });
  }

  methodForOperation(op: DataSourceOperation): string {
    switch (op) {
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
