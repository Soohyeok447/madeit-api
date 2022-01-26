import { BadRequestException } from '@nestjs/common';

export class AlarmValidationException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
