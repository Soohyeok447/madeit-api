import { BadRequestException } from '../../../../common/exceptions/BadRequestException';

export class InvalidTimeException extends BadRequestException {
  public constructor(time: number, context?: string, logMessage?: string) {
    super(`유효하지않은 time ${time}`, 1, context, logMessage);
  }
}
