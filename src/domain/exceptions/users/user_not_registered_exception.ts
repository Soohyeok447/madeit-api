import { ServiceUnavailableException } from '@nestjs/common';

export class UserNotRegisteredException extends ServiceUnavailableException {
  constructor() {
    super(`유저 등록이 필요합니다.`);
  }
}
