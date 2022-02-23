export class HttpException {
  private _message: string;
  private _errorCode: number;
  private _statusCode: number;

  constructor(
    message: string,
    errorCode: number,
    statusCode: number,
  ) {
    this._message = message;
    this._errorCode = errorCode;
    this._statusCode = statusCode;
  }

  getMessage = () => {
    return this._message;
  }

  getErrorCode = () => {
    return this._errorCode;
  }

  getStatusCode = () => {
    return this._statusCode;
  }
}