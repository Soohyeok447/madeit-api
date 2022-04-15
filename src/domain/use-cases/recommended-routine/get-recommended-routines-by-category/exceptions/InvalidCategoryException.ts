import { BadRequestException } from '../../../../common/exceptions/BadRequestException';

export class InvalidCategoryException extends BadRequestException {
  public constructor(context?: string, logMessage?: string) {
    super('유효하지 않은 category입니다', 1, context, logMessage);
  }
}
