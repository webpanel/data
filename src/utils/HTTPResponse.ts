export class HTTPResponse {
  status: number;
  data: any;

  constructor(data: any, status: number) {
    this.data = data;
    this.status = status;
  }

  // getData(): any {
  //   return this.dataGetter ? this.dataGetter(this) : this.data;
  // }
}
