import { NotFoundException } from '../../../../common/exceptions/NotFoundException';

export class BannerNotFoundException extends NotFoundException {
  public constructor(context?: string, logMessage?: string) {
    super('존재하지 않는 배너입니다', 88, context, logMessage);
  }
}
