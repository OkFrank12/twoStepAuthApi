export enum ERROR_STATS {
  OK = 200,
  CREATED = 201,
  DELETE = 202,
  UPDATED = 200,
  NOT_VERIFIED = 403,
  UN_AUTHOURISED = 401,
  NOT_FOUND = 404,
  UN_FULFILLED = 500,
}

interface iError {
  name: string;
  message: string;
  status: ERROR_STATS;
  success: boolean;
}

export class errorSetUp extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly status: ERROR_STATS;
  public readonly success: boolean = false;

  constructor(args: iError) {
    super(args.message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name;
    this.message = args.message;
    this.status = args.status;

    if (args.success !== undefined) {
      this.success = args.success;
    }

    Error.captureStackTrace(this);
  }
}
