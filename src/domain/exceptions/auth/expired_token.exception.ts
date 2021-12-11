import { BadRequestException } from '@nestjs/common';

export class ExpiredTokenException extends BadRequestException {
  constructor() {
    super('토큰 유효기간이 지났습니다.');
  }
}
