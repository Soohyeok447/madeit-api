import { ConflictException } from '../../../../common/exceptions/ConflictException';

export class CartConflictException extends ConflictException {
  constructor() {
    super('이미 담긴 추천 루틴 존재', 1);
  }
}
