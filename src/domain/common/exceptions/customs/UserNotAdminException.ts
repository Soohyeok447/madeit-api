import { UnauthorizedException } from '../UnauthorizedException';

export class UserNotAdminException extends UnauthorizedException {
  constructor() {
    super(`어드민이 아님`, 73);
  }
}
