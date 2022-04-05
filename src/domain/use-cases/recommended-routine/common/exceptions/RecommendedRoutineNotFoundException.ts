import { NotFoundException } from '../../../../common/exceptions/NotFoundException';

export class RecommendedRoutineNotFoundException extends NotFoundException {
  public constructor() {
    super(`추천 루틴을 찾을 수 없습니다`, 72);
  }
}
