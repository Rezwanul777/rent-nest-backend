import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../utils/sendResponse";

const notFound = (req: Request, res: Response) =>
  sendResponse(res, {
    statusCode: httpStatus.NOT_FOUND,
    success: false,
    message: "Route not found",
    errorDetails: [{ message: `${req.method} ${req.originalUrl} does not exist` }],
  });

export default notFound;