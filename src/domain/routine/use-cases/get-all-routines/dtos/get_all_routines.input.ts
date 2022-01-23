import { Resolution } from "src/domain/__common__/enums/resolution.enum";

export class GetAllRoutinesInput {
  next?: string;

  size: number;

  resolution: Resolution;
}
