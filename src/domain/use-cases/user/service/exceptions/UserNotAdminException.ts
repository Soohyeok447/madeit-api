import { UnauthorizedException } from '@nestjs/common';

export class UserNotAdminException extends UnauthorizedException {
  constructor() {
    super(`어드민이 아님`);
  }
}
