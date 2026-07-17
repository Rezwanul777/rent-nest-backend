import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

const validateRequest = (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;