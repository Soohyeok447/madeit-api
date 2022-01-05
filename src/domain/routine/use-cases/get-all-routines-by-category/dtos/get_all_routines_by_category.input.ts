import { Category } from "src/domain/common/enums/category.enum";

export class GetAllRoutinesByCategoryInput {
  next?: string;

  size: number;

  category: Category;
}
