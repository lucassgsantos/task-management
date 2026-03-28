export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const badRequest = (message: string, code = 'BAD_REQUEST') =>
  new AppError(message, 400, code);

export const unauthorized = (message: string, code = 'UNAUTHORIZED') =>
  new AppError(message, 401, code);

export const notFound = (message: string, code = 'NOT_FOUND') =>
  new AppError(message, 404, code);

export const conflict = (message: string, code = 'CONFLICT') =>
  new AppError(message, 409, code);
