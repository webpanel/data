import {
  Connector,
  DataSourceRequest,
  HTTPRequest,
  HTTPResponse,
} from "./Connector";
import {
  ResourceCollectionResponse,
  ResourceResponse,
  ResponseDataTransformer,
} from "./ResponseDataTransformer";
import { ThunkAsync, resolveOptionalThunkAsync } from "ts-thunk";

// import fetch from "node-fetch";

export interface HTTPConnectorConfiguration {
  responseDataTransformer?: ResponseDataTransformer;
  headers?: ThunkAsync<{ [key: string]: string }>;
}

export class HTTPConnector implements Connector {
  responseTransformer: ResponseDataTransformer;

  constructor(private config: HTTPConnectorConfiguration = {}) {
    this.responseTransformer =
      config.responseDataTransformer || new ResponseDataTransformer();
  }

  protected async sendHttpRequest(request: HTTPRequest): Promise<HTTPResponse> {
    let defaultHeaders: { [index: string]: string } = {
      "content-type": "application/json",
    };
    const headers = {
      ...defaultHeaders,
      ...(await resolveOptionalThunkAsync(this.config.headers)),
    };

    let res = await fetch(request.getUrl(), {
      method: request.method,
      body: request.data,
      headers,
    });

    let data = null;
    if (res.status !== 204) {
      const contentType = res.headers.get("content-type");
      switch (contentType && contentType.split(";")[0]) {
        case "application/json":
          data = await res.json();
          break;
        default:
          data = await res.text();
      }
    }

    return new HTTPResponse(data, res.status);
  }

  getErrorMessageFromResponse(res: HTTPResponse): string {
    return (
      (res.data &&
        (res.data.error_description || res.data.error || res.data.message)) ||
      res.data
    );
  }

  protected transformRequest(request: DataSourceRequest): HTTPRequest {
    throw new Error("build request must be implemented");
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
    return this.transformResponse(res, request);
  }
}
