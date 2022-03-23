import { NotFoundException } from '../../../../common/exceptions/NotFoundException';

export class RecommendedRoutineNotFoundException extends NotFoundException {
  constructor() {
    super('포인트를 얻을 수 없는 루틴입니다', 3);
  }
}
