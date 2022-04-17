import { NotFoundException } from '../../../../common/exceptions/NotFoundException';

export class RecommendedRoutineNotFoundException extends NotFoundException {
  public constructor(context?: string, logMessage?: string) {
    super(`추천 루틴을 찾을 수 없습니다`, 72, context, logMessage);
  }
}
