import { UseCase } from '../../UseCase';
import { ReissueAccessTokenResponse } from '../response.index';
import { ReissueAccessTokenUsecaseParams } from './dtos/ReissueAccessTokenUsecaseParams';

export abstract class ReissueAccessTokenUseCase
  implements
    UseCase<ReissueAccessTokenUsecaseParams, ReissueAccessTokenResponse>
{
  abstract execute(
    params: ReissueAccessTokenUsecaseParams,
  ): ReissueAccessTokenResponse;
}
