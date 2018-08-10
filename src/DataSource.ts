import { AuthSession } from 'webpanel-auth';

import {
  isConnectorError,
  Connector,
  DataSourceRequest
} from './connectors/Connector';
// import { HTTPResponse } from './utils/HTTPResponse';
import { DataSourceOperation } from './DataSourceRequest';
import {
  ResourceCollectionResponse,
  ResourceResponse
} from './connectors/ResponseDataTransformer';

export type DataSourceArgumentType =
  | DataSourceArgumentMap
  | string
  | number
  | null;
export interface DataSourceArgumentMap {
  [key: string]: DataSourceArgumentType | DataSourceArgumentType[];
}

export class DataSource {
  name: string;
  connector: Connector;
  url: string;

  constructor(name: string, connector: Connector, url: string) {
    this.name = name;
    this.connector = connector;
    this.url = url;
  }

  async list(
    name: string,
    fields?: string[],
    filters?: { [key: string]: DataSourceArgumentMap },
    search?: string,
    sorting?: string[],
    offset?: number,
    limit?: number,
    args?: DataSourceArgumentMap
  ): Promise<any> {
    return this.send({
      operation: DataSourceOperation.list,
      name,
      fields,
      filters,
      search,
      sorting,
      offset,
      limit,
      args
    });
  }
  async create(
    name: string,
    data: { [key: string]: string },
    fields?: string[],
    args?: DataSourceArgumentMap
  ): Promise<any> {
    return this.send({
      operation: DataSourceOperation.create,
      name,
      fields,
      data,
      args
    });
  }
  async read(
    name: string,
    id: string | number | undefined,
    fields?: string[],
    args?: DataSourceArgumentMap
  ): Promise<any> {
    return this.send({
      operation: DataSourceOperation.read,
      name,
      fields,
      id,
      args
    });
  }
  async update(
    name: string,
    id: string | number,
    data: { [key: string]: string },
    fields?: string[],
    args?: DataSourceArgumentMap
  ): Promise<any> {
    return this.send({
      operation: DataSourceOperation.update,
      name,
      fields,
      id,
      data,
      args
    });
  }
  async delete(
    name: string,
    id: string | number,
    fields?: string[],
    args?: DataSourceArgumentMap
  ): Promise<any> {
    return this.send({
      operation: DataSourceOperation.delete,
      name,
      fields,
      id,
      args
    });
  }

  async send(params: {
    operation: DataSourceOperation;
    name: string;
    fields?: string[];
    id?: string | number;
    data?: any;
    filters?: { [key: string]: DataSourceArgumentMap };
    search?: string;
    sorting?: string[];
    offset?: number;
    limit?: number;
    args?: DataSourceArgumentMap;
  }): Promise<ResourceResponse | ResourceCollectionResponse | null> {
    const dataSourceRequest = new DataSourceRequest({
      name: params.name,
      url: this.url,
      operation: params.operation,
      id: params.id,
      data: params.data,
      fields: params.fields,
      filters: params.filters,
      search: params.search,
      sorting: params.sorting,
      offset: params.offset,
      limit: params.limit,
      arguments: params.args
    });

    try {
      return await this.connector.send(dataSourceRequest);
    } catch (err) {
      if (isConnectorError(err)) {
        if (err.authorization) {
          AuthSession.current().logout();
          return null;
        }
      }

      throw err;
    }
  }
}
