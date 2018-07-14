import { cloneDeep } from 'lodash';

export enum DataSourceOperation {
  list = 'list',
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete'
}

export interface SortAttribute {
  name: string;
  sort: 'asc' | 'desc';
}

export class DataSourceRequest {
  name: string;
  url: string;
  operation: DataSourceOperation;
  offset: number = 0;
  limit?: number;
  fields: { [key: string]: string } = {};
  filters: { [key: string]: string } = {};
  sorting: string[] = [];
  id?: string | number = undefined;
  data?: any = undefined;
  arguments?: { [key: string]: string } = {};

  constructor(variables: any = {}) {
    const cloned = cloneDeep(variables);
    this.name = cloned.name;
    this.url = cloned.url || null;
    this.operation = cloned.operation;
    this.offset = cloned.offset || 0;
    this.limit = cloned.limit;
    this.fields = cloned.fields || {};
    this.filters = cloned.filters || {};
    this.sorting = cloned.sorting || [];
    this.id = variables.id;
    this.data = variables.data;
    this.arguments = cloned.arguments;
  }

  // getPage(pageCursor: number): DataSourceRequest {
  //   const req = new DataSourceRequest(this);
  //   if (pageCursor) {
  //     req.page = pageCursor;
  //   }
  //   return req;
  // }

  // field(variable: string, value: string): DataSourceRequest {
  //   const req = new DataSourceRequest(this);
  //   req.fields[variable] = value;
  //   return req;
  // }

  // withFields(fields: { [key: string]: string }): DataSourceRequest {
  //   const req = new DataSourceRequest(this);
  //   req.fields = fields;
  //   return req;
  // }

  // filter(variable: string, value: string): DataSourceRequest {
  //   const req = new DataSourceRequest(this);
  //   req.filters[variable] = value;
  //   return req;
  // }

  // withFilters(filters: { [key: string]: string }): DataSourceRequest {
  //   const req = new DataSourceRequest(this);
  //   req.filters = filters;
  //   return req;
  // }

  // paginate(limit: number | null): DataSourceRequest {
  //   const req = new DataSourceRequest(this);
  //   req.limit = limit;
  //   if (!limit) {
  //     req.page = null;
  //   }
  //   return req;
  // }

  // sort(array: string[]) {
  //   const req = new DataSourceRequest(this);
  //   req.sorting = array;
  //   return req;
  // }

  // withParams(params: string[]) {
  //   const req = new DataSourceRequest(this);
  //   req.params = params;
  //   return req;
  // }
}
