import { ConflictException } from '../../../../common/exceptions/ConflictException';

export class ConflictRoutineAlarmException extends ConflictException {
  constructor(conflictDay: number[], time: string) {
    super(`[${conflictDay}] ${time} 중복`, 2);
  }
}

//TODO 수정
