import { BadRequestException } from '@nestjs/common';

export class GoogleInvalidTokenException extends BadRequestException {
  constructor() {
    super('유효하지 않은 구글 토큰');
  }
}
