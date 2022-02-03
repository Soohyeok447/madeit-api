import { RoutineModel } from 'src/domain/models/RoutineModel';

export abstract class RoutineCommonService {
  abstract assertRoutine(routine: RoutineModel): Promise<void>;
}
