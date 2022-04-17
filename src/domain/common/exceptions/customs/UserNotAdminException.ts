import { UnauthorizedException } from '../UnauthorizedException';

export class UserNotAdminException extends UnauthorizedException {
  public constructor(context?: string, logMessage?: string) {
    super(`어드민이 아님`, 73, context, logMessage);
  }
}
