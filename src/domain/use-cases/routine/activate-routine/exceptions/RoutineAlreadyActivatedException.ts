import { ConflictException } from '../../../../common/exceptions/ConflictException';

export class RoutineAlreadyActivatedException extends ConflictException {
  constructor() {
    super('이미 활성화 된 루틴입니다', 1);
  }
}
