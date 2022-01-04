import { NotFoundException } from '@nestjs/common';

export class AlarmNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
