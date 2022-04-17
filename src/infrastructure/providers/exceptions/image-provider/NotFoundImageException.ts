import { NotFoundException } from '../../../../domain/common/exceptions/NotFoundException';

export class NotFoundImageException extends NotFoundException {
  public constructor(context?: string, logMessage?: string) {
    super('이미지 없음', 75, context, logMessage);
  }
}
