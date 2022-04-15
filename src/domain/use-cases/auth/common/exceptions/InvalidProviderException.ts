import { BadRequestException } from '../../../../common/exceptions/BadRequestException';

export class InvalidProviderException extends BadRequestException {
  public constructor(context?: string, logMessage?: string) {
    super('유효하지 않은 provider query', 1, context, logMessage);
  }
}
