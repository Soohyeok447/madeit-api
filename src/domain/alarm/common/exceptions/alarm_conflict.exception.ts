import { ConflictException } from '@nestjs/common';

export class AlarmConflictException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
