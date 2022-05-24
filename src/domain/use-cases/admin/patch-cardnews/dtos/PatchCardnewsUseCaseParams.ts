import { MulterFile } from '../../../../common/types';

export class PatchCardnewsUseCaseParams {
  public readonly recommendedRoutineId: string;

  public readonly cardnews: MulterFile[];

  public readonly accessToken: string;
}
