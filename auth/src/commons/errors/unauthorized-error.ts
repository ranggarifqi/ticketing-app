import { CustomError } from ".";
import { ErrorResponse } from "../responses/error";

export class UnauthorizedError extends CustomError {
  public statusCode: number = 401;
  public message: string;

  constructor(msg: string) {
    super(msg);
    this.message = msg;

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
