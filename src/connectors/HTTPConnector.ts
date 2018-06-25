import { AuthSession } from 'webpanel-auth';
import fetch from 'node-fetch';

import {
  Connector,
  HTTPResponse,
  HTTPRequest,
  DataSourceRequest
} from './Connector';
import {
  ResponseDataTransformer,
  ResourceResponse,
  ResourceCollectionResponse
} from './ResponseDataTransformer';

export interface HTTPConnectorConfiguration {
  responseDataTransformer?: ResponseDataTransformer;
}

export class HTTPConnector implements Connector {
  responseTransformer: ResponseDataTransformer;

  constructor(config: HTTPConnectorConfiguration = {}) {
    this.responseTransformer =
      config.responseDataTransformer || new ResponseDataTransformer();
  }

  protected async sendHttpRequest(request: HTTPRequest): Promise<HTTPResponse> {
    const accessToken = AuthSession.current().accessToken;

    let res = await fetch(request.url, {
      method: request.method,
      body: request.data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });

    let json = await res.json();
    return new HTTPResponse(json, res.status);
  }

  protected transformRequest(request: DataSourceRequest): HTTPRequest {
    throw new Error('build request must be implemented');
  }

  protected async transformResponse(
    response: HTTPResponse,
    request: DataSourceRequest
  ): Promise<ResourceResponse | ResourceCollectionResponse | null> {
    return this.responseTransformer.handle(request.operation, response);
  }

  async send(
    request: DataSourceRequest
  ): Promise<ResourceResponse | ResourceCollectionResponse | null> {
    const req = this.transformRequest(request);
    const res = await this.sendHttpRequest(req);
    return this.transformResponse(res.data, request);
  }
}
