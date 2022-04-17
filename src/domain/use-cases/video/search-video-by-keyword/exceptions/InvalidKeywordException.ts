import { BadRequestException } from '../../../../common/exceptions/BadRequestException';

export class InvalidKeywordException extends BadRequestException {
  public constructor(context?: string, logMessage?: string) {
    super('유효하지 않은 요청입니다', 3, context, logMessage);
  }
}
