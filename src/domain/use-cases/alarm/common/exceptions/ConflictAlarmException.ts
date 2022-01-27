import { ConflictException } from '@nestjs/common';
import { Day } from 'src/domain/enums/Day';

export class ConflictAlarmException extends ConflictException {
  constructor(conflictDay: Day[], time: string) {
    super(`[${conflictDay}] ${time} 중복`);
  }
}
