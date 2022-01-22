import { Resolution } from "src/domain/common/enums/resolution.enum";

export class GetRoutineDetailInput {
  routineId: string;

  resolution: Resolution // resolution for finding images
}
