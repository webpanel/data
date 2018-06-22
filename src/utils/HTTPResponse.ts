export class HTTPResponse {
  status: number;
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}
