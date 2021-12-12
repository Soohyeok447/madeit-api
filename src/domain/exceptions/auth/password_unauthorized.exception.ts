import { UnauthorizedException } from '@nestjs/common';

export class PasswordUnauthorizedException extends UnauthorizedException {
  constructor() {
    super('잘못된 비밀번호');
  }
}
