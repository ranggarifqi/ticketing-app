import { CustomError } from ".";
import { ErrorResponse } from "../responses/error";

export class NotFoundError extends CustomError {
  public statusCode: number = 404;
  public message: string;

  constructor(msg: string) {
    super(msg);
    this.message = msg;

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
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
