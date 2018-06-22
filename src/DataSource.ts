import { AuthSession } from 'webpanel-auth';

import {
  isConnectorError,
  Connector,
  IConnector,
  DataSourceRequest
} from './connectors/Connector';
import { HTTPResponse } from './utils/HTTPResponse';
import { DataSourceOperation } from './DataSourceRequest';

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

  constructor(name: string, connector: IConnector, url: string) {
    this.name = name;
    this.connector = new connector();
    this.url = url;
  }

  async list(
    name: string,
    fields: string[]
    // args: { [key: string]: any }
  ): Promise<any> {
    return this.send({ operation: DataSourceOperation.list, name, fields });
  }
  async create(
    name: string,
    data: { [key: string]: string },
    fields: string[]
  ): Promise<any> {
    return this.send({
      operation: DataSourceOperation.create,
      name,
      fields,
      data
    });
  }
  async read(
    name: string,
    id: string | number | undefined,
    fields: string[]
    // args?: { [key: string]: any }
  ): Promise<any> {
    // args = args || {};
    // let _args = { ...args };
    return this.send({ operation: DataSourceOperation.read, name, fields, id });
  }
  async update(
    name: string,
    id: string | number,
    data: { [key: string]: string },
    fields: string[]
  ): Promise<any> {
    return this.send({
      operation: DataSourceOperation.update,
      name,
      fields,
      id,
      data
    });
  }
  async delete(
    name: string,
    id: string | number,
    fields: string[]
  ): Promise<any> {
    return this.send({
      operation: DataSourceOperation.delete,
      name,
      fields,
      id
    });
  }

  async send(
    params: {
      operation: DataSourceOperation;
      name: string;
      fields: string[];
      id?: string | number;
      data?: any;
    }
    // args: DataSourceArgumentMap = {}
  ): Promise<HTTPResponse | null> {
    const dataSourceRequest = new DataSourceRequest({
      url: this.url,
      operation: params.operation,
      id: params.id,
      data: params.data
    });

    const request = this.connector.transformRequest(dataSourceRequest);

    try {
      let res = await this.connector.send(request);
      return res;
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
