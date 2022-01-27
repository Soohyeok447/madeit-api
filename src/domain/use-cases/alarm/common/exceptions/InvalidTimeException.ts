import { BadRequestException } from '@nestjs/common';

export class InvalidTimeException extends BadRequestException {
  constructor(time: string) {
    super(`유효하지않은 time ${time}`);
  }
}
