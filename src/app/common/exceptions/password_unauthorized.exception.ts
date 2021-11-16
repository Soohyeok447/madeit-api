import { UnauthorizedException } from "@nestjs/common";

export class PasswordUnauthorizedException extends UnauthorizedException {
  constructor() {
    super('비밀번호가 틀립니다.');
  }
}