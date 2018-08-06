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

    let headers: { [index: string]: string } = {
      'content-type': 'application/json'
    };
    if (accessToken) {
      headers.authorization = `Bearer ${accessToken}`;
    }

    let res = await fetch(request.getUrl(), {
      method: request.method,
      body: request.data,
      headers
    });

    let json = res.status !== 204 ? await res.json() : null;
    return new HTTPResponse(json, res.status);
  }

  getErrorMessageFromResponse(res: HTTPResponse): string {
    return res.data.error_description || res.data.error || res.data.message;
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
