export class AppException extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly description: string,
  ) {
    super();
  }
}
