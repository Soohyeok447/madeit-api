import { ConflictException } from '@nestjs/common';
import { Day } from '../../../../../domain/enums/Day';

export class ConflictAlarmException extends ConflictException {
  constructor(conflictDay: Day[], time: string) {
    super(`[${conflictDay}] ${time} 중복`);
  }
}
