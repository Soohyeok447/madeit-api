import { Category } from 'src/domain/common/enums/category.enum';
import { RoutineType } from 'src/domain/common/enums/routine_type.enum';

export class CreateRoutineDto {
  public name: string;

  public type: RoutineType;

  public category: Category;

  public thumbnailUrl: string;

  public introductionScript: string;

  public introductionImageUrl: string;

  public motivation: string;

  public price: number;

  public relatedProducts?: string[];
}
