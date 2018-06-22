import { AuthSession } from 'webpanel-auth';

import {
  Connector,
  HTTPResponse,
  HTTPRequest,
  DataSourceRequest
} from './Connector';

export class HTTPConnector implements Connector {
  async send(req: HTTPRequest): Promise<HTTPResponse> {
    const accessToken = AuthSession.current().accessToken;

    let res = await fetch(req.url, {
      method: req.method,
      body: req.data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });

    let json = await res.json();
    return new HTTPResponse(json);
  }

  transformRequest(request: DataSourceRequest): HTTPRequest {
    throw new Error('build request must be implemented');
  }
}
