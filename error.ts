export class FetchSError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly statusText: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
