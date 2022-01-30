import { BadRequestException } from '@nestjs/common';

export class InvalidTokenException extends BadRequestException {
  constructor() {
    super('유효하지 않은 API토큰');
  }
}
