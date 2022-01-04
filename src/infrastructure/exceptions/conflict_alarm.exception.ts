import { ConflictException } from '@nestjs/common';

export class ConflictAlarmException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
