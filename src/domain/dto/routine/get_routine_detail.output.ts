import { RoutineType } from 'src/domain/models/enum/routine_type.enum';

export class GetRoutineDetailOutput {
  id: string;

  name: string;

  type: RoutineType;

  thumbnailUrl: string;

  introductionScript: string;

  introductionImageUrl: string;

  motivation: string;

  price: number;

  //product id
  relatedProducts?: string[];
}
