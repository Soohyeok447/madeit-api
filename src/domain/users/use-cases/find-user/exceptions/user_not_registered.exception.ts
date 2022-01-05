import { ForbiddenException } from '@nestjs/common';

/**
 * 분명 Jwt토큰 까서 id를 받았는데 찾은 user의 row가 완벽하지 않다? => 등록 필요
 */
export class UserNotRegisteredException extends ForbiddenException {
  constructor() {
    super(`유저 등록이 필요함`);
  }
}
