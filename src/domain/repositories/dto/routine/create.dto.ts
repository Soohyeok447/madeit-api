import { RoutineType } from "src/domain/models/enum/routine_type.enum";

export class CreateRoutineDto {
  public name: string;

  public type: RoutineType;

  public thumbnailUrl: string;

  public introductionScript: string;

  public introductionImageUrl: string;

  public motivation: string;

  public price: number;

  public relatedProducts?: string[];
}
