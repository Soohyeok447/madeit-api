import { Resolution } from "src/domain/common/enums/resolution.enum";

export class GetAllRoutinesInput {
  next?: string;

  size: number;

  resolution: Resolution;
}
