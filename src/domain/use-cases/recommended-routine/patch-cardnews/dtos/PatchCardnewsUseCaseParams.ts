import { MulterFile } from '../../../../common/types';

export class PatchCardnewsUseCaseParams {
  public readonly userId: string;

  public readonly recommendedRoutineId: string;

  public readonly cardnews: MulterFile[];
}
