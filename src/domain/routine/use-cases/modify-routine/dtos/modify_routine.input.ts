import { Category } from "src/domain/__common__/enums/category.enum";
import { RoutineType } from "src/domain/__common__/enums/routine_type.enum";

export class ModifyRoutineInput {
  public userId: string;

  public routineId: string;

  public name: string;

  public type: RoutineType;

  public category: Category;

  public introductionScript: string;

  public motivation: string;

  public price: number;

  public relatedProducts?: string[];

  public cardnews;

  public thumbnail;
}
