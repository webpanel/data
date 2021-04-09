import {
  Connector,
  DataSourceRequest,
  isConnectorError,
} from "./connectors/Connector";
import {
  ResourceCollectionResponse,
  ResourceResponse,
} from "./connectors/ResponseDataTransformer";

import { DataSourceOperation } from "./DataSourceRequest";

export type DataSourceArgumentType =
  | DataSourceArgumentMap
  | string
  | number
  | boolean
  | null
  | undefined;

export type DataSourceAggregationFunction = "MIN" | "MAX" | "AVG" | "SUM";

export interface DataSourceAggregationField {
  name: string;
  function: DataSourceAggregationFunction;
}
export interface DataSourceArgumentMap {
  [key: string]: DataSourceArgumentType | DataSourceArgumentType[];
}
export interface DataSourceArgumentOptions {
  onAuthorizationError?: (error: Error) => void;
}

export class DataSource {
  name: string;
  connector: Connector;
  url: string;

  constructor(
    name: string,
    connector: Connector,
    url: string,
    private options?: DataSourceArgumentOptions
  ) {
    this.name = name;
    this.connector = connector;
    this.url = url;
  }

  async list(
    name: string,
    fields?: string[],
    aggregations?: DataSourceAggregationField[],
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
      aggregations,
      fields,
      filters,
      search,
      sorting,
      offset,
      limit,
      args,
    });
  }
  async create(
    name: string,
    data: any,
    fields?: string[],
    args?: DataSourceArgumentMap
  ): Promise<any> {
    return this.send({
      operation: DataSourceOperation.create,
      name,
      fields,
      data,
      args,
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
      args,
    });
  }
  async update(
    name: string,
    id: string | number,
    data: any,
    fields?: string[],
    args?: DataSourceArgumentMap
  ): Promise<any> {
    return this.send({
      operation: DataSourceOperation.update,
      name,
      fields,
      id,
      data,
      args,
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
      args,
    });
  }

  async send(params: {
    operation: DataSourceOperation;
    name: string;
    fields?: string[];
    id?: string | number;
    data?: any;
    aggregations?: DataSourceAggregationField[];
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
      aggregations: params.aggregations,
      fields: params.fields,
      filters: params.filters,
      search: params.search,
      sorting: params.sorting,
      offset: params.offset,
      limit: params.limit,
      arguments: params.args,
    });

    try {
      return await this.connector.send(dataSourceRequest);
    } catch (err) {
      if (isConnectorError(err)) {
        if (err.authorization && this.options?.onAuthorizationError) {
          this.options?.onAuthorizationError(err);
          return null;
        }
      }

      throw err;
    }
  }
}
