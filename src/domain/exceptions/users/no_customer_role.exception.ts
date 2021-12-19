import { ForbiddenException } from '@nestjs/common';

export class NoCustomerRoleException extends ForbiddenException {
  constructor() {
    super(`customer role이 없음`);
  }
}
