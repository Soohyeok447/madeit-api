import { BadRequestException } from '@nestjs/common';

export class InvalidUsernameException extends BadRequestException {
  constructor() {
    super('유효하지 않은 닉네임');
  }
}
