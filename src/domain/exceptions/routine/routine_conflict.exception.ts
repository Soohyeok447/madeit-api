import { ConflictException } from '@nestjs/common';

export class RoutineNameConflictException extends ConflictException {
  constructor() {
    super('이미 있는 루틴이름');
  }
}
