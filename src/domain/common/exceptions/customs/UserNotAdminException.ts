import { UnauthorizedException } from '../UnauthorizedException';

export class UserNotAdminException extends UnauthorizedException {
  public constructor() {
    super(`어드민이 아님`, 73);
  }
}
