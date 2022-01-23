import { Resolution } from "src/domain/__common__/enums/resolution.enum";

export class GetRoutineDetailInput {
  routineId: string;

  resolution: Resolution // resolution for finding images
}
