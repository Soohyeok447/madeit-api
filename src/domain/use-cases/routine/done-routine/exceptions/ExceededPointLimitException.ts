import { NotFoundException } from '../../../../common/exceptions/NotFoundException';

export class ExceededPointLimitException extends NotFoundException {
  public constructor(context?: string, logMessage?: string) {
    super('일일 1000포인트만 적립 가능합니다.', 4, context, logMessage);
  }
}
