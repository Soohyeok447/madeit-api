import { UnauthorizedException } from '../../../../common/exceptions/UnauthorizedException';

export class InvalidRefreshAdminTokenException extends UnauthorizedException {
  public constructor(context?: string, logMessage?: string) {
    super('유효하지 않은 어드민 재발급토큰입니다', 1, context, logMessage);
  }
}
