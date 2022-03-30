import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../commons/errors/database-connection-error";
import { RequestValidationError } from "../commons/errors/request-validation-error";

interface ErrorProps {
  message: string;
  field?: string;
}
interface ErrorResponse {
  errors: ErrorProps[];
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    const formattedErrors: ErrorProps[] = err.getErrors().map((v) => {
      return {
        message: v.msg,
        field: v.param,
      };
    });
    return res.status(400).send({ errors: formattedErrors });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(500).send({
      errors: [
        {
          message: err.getReason(),
        },
      ],
    });
  }

  return res.status(500).send({
    errors: [
      {
        message: "Internal server error",
      },
    ],
  });
};
