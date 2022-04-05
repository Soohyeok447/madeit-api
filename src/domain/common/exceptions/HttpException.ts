export class HttpException {
  private _message: string;
  private _errorCode: number;
  private _statusCode: number;

  public constructor(message: string, errorCode: number, statusCode: number) {
    this._message = message;
    this._errorCode = errorCode;
    this._statusCode = statusCode;
  }

  public getMessage = (): string => {
    return this._message;
  };

  public getErrorCode = (): number => {
    return this._errorCode;
  };

  public getStatusCode = (): number => {
    return this._statusCode;
  };
}
