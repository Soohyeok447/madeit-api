import { NotFoundException } from '../../../../common/exceptions/NotFoundException';

export class RecommendedRoutineNotFoundException extends NotFoundException {
  public constructor(context?: string, logMessage?: string) {
    super('포인트를 얻을 수 없는 루틴입니다', 3, context, logMessage);
  }
}
