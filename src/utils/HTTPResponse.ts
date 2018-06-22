export class HTTPResponse {
  status: number;
  data: any;

  dataGetter: (res: HTTPResponse) => any;

  constructor(data: any) {
    this.data = data;
  }

  getData(): any {
    return this.dataGetter ? this.dataGetter(this) : this.data;
  }
}
