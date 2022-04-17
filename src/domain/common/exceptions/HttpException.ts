export class HttpException {
  private _message: string;
  private _errorCode: number;
  private _statusCode: number;
  private _context: string;
  private _logMessage: string;

  public constructor(
    message: string,
    errorCode: number,
    statusCode: number,
    context?: string,
    logMessage?: string,
  ) {
    this._message = message;
    this._errorCode = errorCode;
    this._statusCode = statusCode;
    this._context = context;
    this._logMessage = logMessage;
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

  public getContext = (): string => {
    return this._context;
  };

  public getLogMessage = (): string => {
    return this._logMessage;
  };
}
