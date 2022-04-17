import { ConflictException } from '../../../../common/exceptions/ConflictException';

export class RoutineAlreadyInactivatedException extends ConflictException {
  public constructor(context?: string, logMessage?: string) {
    super('이미 비활성화 된 루틴입니다', 1, context, logMessage);
  }
}
