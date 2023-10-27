export class BadRequestException extends Error {
  constructor(message?: string, public extra?: any) {
    super(message);
  }
}
