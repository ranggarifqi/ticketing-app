import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../commons/errors/request-validation-error";
import { ErrorResponse } from "../commons/responses/error";

export const validateRequest = (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  next();
};
