import { BadRequestException } from '../../../../../common/exceptions/BadRequestException';

export class GoogleInvalidTokenException extends BadRequestException {
  public constructor(context?: string, logMessage?: string) {
    super('유효하지 않은 구글 토큰', 5, context, logMessage);
  }
}
