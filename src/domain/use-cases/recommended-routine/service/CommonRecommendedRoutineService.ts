import { Injectable } from '@nestjs/common';
import { RecommendedRoutineModel } from '../../../models/RecommendedRoutineModel';
import { RecommendedRoutineNotFoundException } from '../common/exceptions/RecommendedRoutineNotFoundException';

@Injectable()
export class CommonRecommendedRoutineService {
  static assertRoutineExistence(routine: RecommendedRoutineModel) {
    if (!routine) {
      throw new RecommendedRoutineNotFoundException();
    }
  }

}
