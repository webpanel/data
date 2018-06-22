import { cloneDeep } from 'lodash';

export class HTTPRequest {
  url: string;
  method: string;
  data: any;
  headers: { [key: string]: string } = {};

  constructor(variables: any = {}) {
    const cloned = cloneDeep(variables);
    this.url = cloned.url || null;
    this.data = cloned.data || {};
    this.headers = cloned.headers || {};
  }
}
