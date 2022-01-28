import { Resolution } from 'src/domain/enums/Resolution';

export class GetRoutineDetailUsecaseParams {
  routineId: string;

  resolution: Resolution; // resolution for finding images
}
