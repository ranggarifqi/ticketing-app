import { ValidationError } from "express-validator";
import { CustomError } from ".";
import { ErrorProps, ErrorResponse } from "../responses/error";

export class RequestValidationError extends CustomError {
  public statusCode: number = 400;

  private errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Invalid request parameters');
    this.errors = errors;

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  public getErrors = () => {
    return this.errors;
  };

  public serializeError(): ErrorResponse {
    const formattedErrors: ErrorProps[] = this.errors.map((v) => {
      return {
        message: v.msg,
        field: v.param,
      };
    });

    return {
      errors: formattedErrors,
    };
  }
}
