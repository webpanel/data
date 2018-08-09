import { cloneDeep } from 'lodash';
import { stringify, parse } from 'querystring';

export class HTTPRequest {
  url: string;
  querystring: { [key: string]: any } = {};
  method: string;
  data: any;
  headers: { [key: string]: string } = {};

  constructor(variables: any = {}) {
    const cloned = cloneDeep(variables);
    if (!cloned.url) {
      throw new Error(`cannot create new request without url`);
    }
    const [url, qs] = cloned.url.split('?');
    this.url = url;
    this.querystring = Object.assign({}, parse(qs), variables.querystring);
    this.method = cloned.method;
    this.data = cloned.data || {};
    this.headers = cloned.headers || {};
  }

  getUrl() {
    const qs = stringify(this.querystring);
    return qs.length > 0 ? `${this.url}?${qs}` : this.url;
  }

  addParam(key: string, value: any) {
    this.querystring[key] = value;
  }
}
