import { BadRequestException } from '@nestjs/common';

export class WrongCartRequestException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
