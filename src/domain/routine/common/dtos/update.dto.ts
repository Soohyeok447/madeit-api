import { Category } from "src/domain/common/enums/category.enum";

export class UpdateRoutineDto {
  public name?: string;

  public type?: string;

  public category?: Category;

  public thumbnailUrl?: string;

  public introductionScript?: string;

  public introductionImageUrl?: string;

  public motivation?: string;

  public price?: number;

  public relatedProducts?: string[];
}
