import { ConflictException } from '../../../../common/exceptions/ConflictException';

export class RoutineAlreadyActivatedException extends ConflictException {
  public constructor(context?: string, logMessage?: string) {
    super('이미 활성화 된 루틴입니다', 1, context, logMessage);
  }
}
