import { Category } from '../../../common/enums/Category';
import { FixedField } from '../../../common/enums/FixedField';

export class CreateRecommendedRoutineDto {
  public readonly title: string;

  public readonly category: Category;

  public readonly introduction: string;

  public readonly fixedFields: FixedField[];

  public readonly hour?: number;

  public readonly minute?: number;

  public readonly days: number[];

  public readonly alarmVideoId?: string;

  public readonly contentVideoId?: string;

  public readonly youtubeThumbnail?: string;

  public readonly timerDuration?: number;

  public readonly price?: number;

  public readonly point?: number;

  public readonly exp?: number;
}
