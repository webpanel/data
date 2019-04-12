export class HTTPResponse {
  status: number;
  data: any | string | null;

  constructor(data: any, status: number) {
    this.data = data;
    this.status = status;
  }
}
