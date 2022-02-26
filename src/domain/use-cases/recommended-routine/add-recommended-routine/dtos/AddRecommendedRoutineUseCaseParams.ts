import { Category } from "../../../../enums/Category";
import { FixedField } from "../../../../enums/FixedField";

export class AddRecommendedRoutineUseCaseParams {
  public userId: string;
  
  public title: string;

  public category: Category;

  public introduction: string;

  public fixedFields?: FixedField[];

  public hour?: number;

  public minute?: number;

  public days?: number[];

  public alarmVideoId?: string;

  public contentVideoId?: string;

  public timerDuration?: number;

  public price?: number;
}