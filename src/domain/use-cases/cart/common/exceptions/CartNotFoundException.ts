import { NotFoundException } from '../../../../common/exceptions/NotFoundException';

export class CartNotFoundException extends NotFoundException {
  public constructor(context?: string, logMessage?: string) {
    super('장바구니에 해당 추천 루틴이 존재하지 않음', 74, context, logMessage);
  }
}
