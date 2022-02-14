import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../../../domain/models/RoutineModel';
import { RoutineNotFoundException } from '../../patch-thumbnail/exceptions/RoutineNotFoundException';
import { RoutineCommonService } from '../RoutineCommonService';

@Injectable()
export class RoutineCommonServiceImpl implements RoutineCommonService {
  public async assertRoutine(routine: RoutineModel): Promise<void> {
    if (!routine) {
      throw new RoutineNotFoundException();
    }
  }
}
