import { Category } from '../../../../common/enums/Category';
import { FixedField } from '../../../../common/enums/FixedField';

export class AddRecommendedRoutineUseCaseParams {
  public userId: string; // 어드민 체크용

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

  public point?: number;

  public exp?: number;
}
