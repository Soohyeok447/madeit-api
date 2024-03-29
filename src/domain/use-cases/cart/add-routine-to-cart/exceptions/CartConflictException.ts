import { ConflictException } from '../../../../common/exceptions/ConflictException';

export class CartConflictException extends ConflictException {
  public constructor(context?: string, logMessage?: string) {
    super('이미 장바구니에 담은 루틴입니다', 1, context, logMessage);
  }
}
