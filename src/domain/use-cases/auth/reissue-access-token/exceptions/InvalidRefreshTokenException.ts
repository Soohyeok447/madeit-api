import { ForbiddenException } from '../../../../common/exceptions/ForbiddenException';

export class InvalidRefreshTokenException extends ForbiddenException {
  public constructor(context?: string, logMessage?: string) {
    super('refreshToken이 불일치', 2, context, logMessage);
  }
}
