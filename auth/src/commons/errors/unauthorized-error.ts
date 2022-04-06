import { CustomError } from ".";
import { ErrorResponse } from "../responses/error";

const DEFAULT_MSG = "Unauthorized";

export class UnauthorizedError extends CustomError {
  public statusCode: number = 401;
  public message: string;

  constructor(msg?: string) {
    super(msg ?? DEFAULT_MSG);
    this.message = msg ?? DEFAULT_MSG;

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeError = (): ErrorResponse => {
    return {
      errors: [
        {
          message: this.message,
        },
      ],
    };
  };
}
