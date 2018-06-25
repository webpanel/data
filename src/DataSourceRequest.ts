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
  page: number | null = 0;
  limit: number | null = null;
  fields: { [key: string]: string } = {};
  filters: { [key: string]: string } = {};
  // headers: { [key: string]: string } = {};
  sorting: string[] = [];
  // params: string[] = [];
  id?: string | number = undefined;
  data?: any = undefined;

  constructor(variables: any = {}) {
    const cloned = cloneDeep(variables);
    this.name = cloned.name;
    this.url = cloned.url || null;
    this.operation = cloned.operation;
    this.page = cloned.page;
    this.fields = cloned.fields || {};
    this.filters = cloned.filters || {};
    // this.headers = cloned.headers || {};
    this.sorting = cloned.sorting || [];
    // this.params = cloned.params || [];
  }

  getPage(pageCursor: number): DataSourceRequest {
    const req = new DataSourceRequest(this);
    if (pageCursor) {
      req.page = pageCursor;
    }
    return req;
  }

  field(variable: string, value: string): DataSourceRequest {
    const req = new DataSourceRequest(this);
    req.fields[variable] = value;
    return req;
  }

  withFields(fields: { [key: string]: string }): DataSourceRequest {
    const req = new DataSourceRequest(this);
    req.fields = fields;
    return req;
  }

  filter(variable: string, value: string): DataSourceRequest {
    const req = new DataSourceRequest(this);
    req.filters[variable] = value;
    return req;
  }

  withFilters(filters: { [key: string]: string }): DataSourceRequest {
    const req = new DataSourceRequest(this);
    req.filters = filters;
    return req;
  }

  paginate(limit: number | null): DataSourceRequest {
    const req = new DataSourceRequest(this);
    req.limit = limit;
    if (!limit) {
      req.page = null;
    }
    return req;
  }

  sort(array: string[]) {
    const req = new DataSourceRequest(this);
    req.sorting = array;
    return req;
  }

  // withParams(params: string[]) {
  //   const req = new DataSourceRequest(this);
  //   req.params = params;
  //   return req;
  // }
}
