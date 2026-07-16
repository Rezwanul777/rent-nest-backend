import { ErrorDetails } from "../types/apiResponse";

class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorDetails?: ErrorDetails[];

  constructor(
    statusCode: number,
    message: string,
    errorDetails?: ErrorDetails[],
  ) {
    super(message);

    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.errorDetails = errorDetails;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export default AppError;