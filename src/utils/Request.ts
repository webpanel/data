import { cloneDeep } from 'lodash';

export class Request {
  url: string;
  data: any;
  page: number | null = 0;
  limit: number | null = null;
  fields: { [key: string]: string } = {};
  filters: { [key: string]: string } = {};
  headers: { [key: string]: string } = {};
  sorting: string[] = [];
  params: string[] = [];

  constructor(variables: any = {}) {
    const cloned = cloneDeep(variables);
    this.url = cloned.url || null;
    this.data = cloned.data || {};
    this.page = cloned.page;
    this.filters = cloned.filters || {};
    this.headers = cloned.headers || {};
    this.sorting = cloned.sorting || [];
    this.params = cloned.params || [];
  }

  getPage(pageCursor: number): Request {
    const req = new Request(this);
    if (pageCursor) {
      req.page = pageCursor;
    }
    return req;
  }

  field(variable: string, value: string): Request {
    const req = new Request(this);
    req.fields[variable] = value;
    return req;
  }

  withFields(fields: { [key: string]: string }): Request {
    const req = new Request(this);
    req.fields = fields;
    return req;
  }

  filter(variable: string, value: string): Request {
    const req = new Request(this);
    req.filters[variable] = value;
    return req;
  }

  withFilters(filters: { [key: string]: string }): Request {
    const req = new Request(this);
    req.filters = filters;
    return req;
  }

  paginate(limit: number | null): Request {
    const req = new Request(this);
    req.limit = limit;
    if (!limit) {
      req.page = null;
    }
    return req;
  }

  sort(array: string[]) {
    const req = new Request(this);
    req.sorting = array;
    return req;
  }

  withParams(params: string[]) {
    const req = new Request(this);
    req.params = params;
    return req;
  }
}
