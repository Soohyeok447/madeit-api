import { Resolution } from 'src/domain/enums/Resolution';

export class GetRoutineDetailUsecaseDto {
  routineId: string;

  resolution: Resolution; // resolution for finding images
}
