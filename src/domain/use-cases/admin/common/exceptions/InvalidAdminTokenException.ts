import { UnauthorizedException } from '../../../../common/exceptions/UnauthorizedException';

export class InvalidAdminTokenException extends UnauthorizedException {
  public constructor(context?: string, logMessage?: string) {
    super('유효하지 않은 어드민 토큰입니다', 87, context, logMessage);
  }
}
