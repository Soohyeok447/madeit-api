import { ForbiddenException } from '../../../../common/exceptions/ForbiddenException';

export class NoRefreshTokenException extends ForbiddenException {
  public constructor(context?: string, logMessage?: string) {
    super('이미 로그아웃한 상태입니다', 1, context, logMessage);
  }
}
