import { Response } from "express";
import { ErrorResponse, SuccessResponse } from "../types/apiResponse";


const sendResponse = <T>(
  res: Response,
  response: SuccessResponse<T> | ErrorResponse,
) => {
  const { statusCode, ...responseBody } = response;
  return res.status(statusCode).json(responseBody);
};

export default sendResponse;