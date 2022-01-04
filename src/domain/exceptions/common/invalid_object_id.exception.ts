import { BadRequestException } from '@nestjs/common';

export class InvalidObjectIdException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
