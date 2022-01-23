import { Category } from "src/domain/__common__/enums/category.enum";
import { Resolution } from "src/domain/__common__/enums/resolution.enum";

export class GetAllRoutinesByCategoryInput {
  next?: string;

  size: number;

  category: Category;

  resolution: Resolution;
}
