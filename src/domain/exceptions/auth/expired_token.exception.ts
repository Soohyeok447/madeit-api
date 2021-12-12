import { BadRequestException } from '@nestjs/common';

export class ExpiredTokenException extends BadRequestException {
  constructor() {
    super('만료된 토큰');
  }
}
