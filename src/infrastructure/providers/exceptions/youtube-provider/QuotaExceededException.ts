import { NotFoundException } from '../../../../domain/common/exceptions/NotFoundException';

export class QuotaExceededException extends NotFoundException {
  public constructor(context?: string, logMessage?: string) {
    super(
      '유튜브 검색 API의 일일 할당량을 초과했습니다. 내일 다시 시도해주세요. 빠른 시일내에 유튜브 할당량을 증가시키겠습니다.',
      2,
      context,
      logMessage,
    );
  }
}
