export default class ResponseError extends Error {
  status: number;
  statusText: string;
  data?: unknown;

  constructor(
    response: Pick<Response, 'status' | 'statusText'>,
    data?: unknown
  ) {
    super();
    this.status = response.status;
    this.statusText = response.statusText;
    this.data = data;
  }
}
