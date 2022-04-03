import { ConflictException } from '../../../../common/exceptions/ConflictException';

export class TitleConflictException extends ConflictException {
  public constructor() {
    super('중복되는 추천 루틴 제목 존재', 1);
  }
}
