import { Category } from "src/domain/common/enums/category.enum";
import { Resolution } from "src/domain/common/enums/resolution.enum";

export class GetAllRoutinesByCategoryInput {
  next?: string;

  size: number;

  category: Category;

  resolution: Resolution;
}
