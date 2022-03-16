import { MulterFile } from '../../../../common/types';

export class PatchCardnewsUseCaseParams {
  userId: string;

  recommendedRoutineId: string;

  cardnews: MulterFile[];
}
