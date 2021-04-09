import { DataSourceOperation } from "../DataSourceRequest";

export interface ResourceResponse {
  data: any;
}
export interface ResourceCollectionResponse {
  items: any[];
  aggregations: { [key: string]: any };
  count: number;
}

export class ResponseDataTransformer {
  handle(operation: DataSourceOperation, data: any): Promise<any> {
    switch (operation) {
      case DataSourceOperation.list:
        return this.list(data);
      case DataSourceOperation.create:
        return this.create(data);
      case DataSourceOperation.read:
        return this.read(data);
      case DataSourceOperation.update:
        return this.update(data);
      case DataSourceOperation.delete:
        return this.delete(data);
    }
  }

  async list(data: any): Promise<ResourceCollectionResponse> {
    return {
      items: data.items,
      aggregations: data.aggregations,
      count: data.count,
    };
  }

  async create(data: any): Promise<ResourceResponse> {
    return data;
  }
  async read(data: any): Promise<ResourceResponse> {
    return data;
  }
  async update(data: any): Promise<ResourceResponse> {
    return data;
  }
  async delete(data: any): Promise<ResourceResponse> {
    return data;
  }
}
