import { Injectable } from '@nestjs/common';
import { RecommendedRoutineModel } from '../../../models/RecommendedRoutineModel';
import { RecommendedRoutineNotFoundException } from '../common/exceptions/RecommendedRoutineNotFoundException';

@Injectable()
export class CommonRecommendedRoutineService {
  static assertRoutineExistence(recommendedRoutine: RecommendedRoutineModel) {
    if (!recommendedRoutine) {
      throw new RecommendedRoutineNotFoundException();
    }
  }

}
