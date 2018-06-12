import fetch from 'node-fetch';
import { Connector, Request, Response } from './Connector';

export class RestConnectorError extends Error {
  status: number;
  response: Response;

  constructor(
    status: number,
    response: Response,
    message?: string | undefined
  ) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

export class RestConnector implements Connector {
  async send(req: Request, method: string): Promise<Response> {
    let res = await fetch(req.url, {
      method: method,
      body: req.data,
      headers: req.headers
    });

    if (res.status < 200 || res.status >= 300) {
      let json = await res.json();
      throw new RestConnectorError(
        res.status,
        res,
        json.error_description || json.error
      );
    }

    return res;
  }
}
