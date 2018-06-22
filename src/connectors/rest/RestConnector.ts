import { HTTPRequest, HTTPResponse } from '../Connector';
import { HTTPConnector } from '../HTTPConnector';
import { DataSourceOperation } from '../../DataSourceRequest';

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
  async send(req: HTTPRequest): Promise<HTTPResponse> {
    let res = await super.send(req);

    if (res.status < 200 || res.status >= 300) {
      throw new RestConnectorError(
        res.status,
        res,
        res.data.error_description || res.data.error
      );
    }

    return res;
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
