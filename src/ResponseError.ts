export default class ResponseError extends Error {
  status: number

  statusText: string

  data: any

  constructor(response: Response, data: any) {
    super()
    this.status = response.status
    this.statusText = response.statusText
    this.data = data
  }
}
