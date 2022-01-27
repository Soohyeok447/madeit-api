import { Category } from 'src/domain/enums/Category';
import { Resolution } from 'src/domain/enums/Resolution';

export class GetAllRoutinesByCategoryUsecaseDto {
  next?: string;

  size: number;

  category: Category;

  resolution: Resolution;
}
