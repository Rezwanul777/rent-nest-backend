export interface SuccessResponse<T> {
  statusCode: number;
  success: true;
  message: string;
  //meta?: PaginationMeta;
  data?: T;
}

export interface ErrorDetails {
  field?: string;
  message: string;
}

export interface ErrorResponse {
  statusCode: number;
  success: false;
  message: string;
  errorDetails?: ErrorDetails[];
  errorStack?: string;
}