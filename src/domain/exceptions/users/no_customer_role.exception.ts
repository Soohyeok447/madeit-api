import { HttpException, UnauthorizedException } from '@nestjs/common';

export class NoCustomerRoleException extends HttpException {
  constructor() {
    super(`customer role이 없음`, 460);
  }
}
